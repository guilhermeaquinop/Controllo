'use server'
// Server Actions do Primeiro acesso e dos Ajustes. Cada uma confere o usuário, valida com Zod
// e grava com o cliente da sessão (o RLS garante que só mexe nas próprias linhas).
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase/server'
import { exigirUsuario } from '@/lib/acesso/usuario'
import { ERRO_GENERICO } from '@/lib/acesso/mensagens'
import { ROTA_INICIAL } from '@/lib/acesso/rotas'
import { hojeEmSaoPaulo } from '@/lib/datas'
import { DADOS_INVALIDOS, type Resultado } from '@/lib/resultado'
import {
  esquemaAjustes,
  esquemaArquivarCategoria,
  esquemaIdCategoria,
  esquemaNovaCategoria,
  esquemaRenomearCategoria,
  esquemaSaldoInicial,
} from './esquemas'

// Códigos de erro do Postgres que viram mensagem para a pessoa.
const NOME_REPETIDO = '23505' // unique_violation
const EM_USO = '23503' // foreign_key_violation

const FALHOU: Resultado = { ok: false, erro: ERRO_GENERICO }
const SEM_CATEGORIA: Resultado = { ok: false, erro: 'Categoria não encontrada. Recarregue a página.' }

/** Primeiro acesso: grava saldo e data, cria as faixas e as categorias padrão. */
export async function concluirPrimeiroAcesso(entrada: unknown): Promise<Resultado> {
  const dados = esquemaSaldoInicial.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()

  const supabase = await criarClienteServidor()
  const { error } = await supabase.rpc('criar_dados_iniciais', {
    p_saldo_centavos: dados.data.saldo,
    p_data: dados.data.data,
  })
  if (error) return FALHOU
  redirect(ROTA_INICIAL)
}

/** "Pular por agora": começa com saldo zero hoje. Dá para ajustar depois em Ajustes. */
export async function pularPrimeiroAcesso(): Promise<Resultado> {
  await exigirUsuario()
  const supabase = await criarClienteServidor()
  const { error } = await supabase.rpc('criar_dados_iniciais', { p_saldo_centavos: 0, p_data: hojeEmSaoPaulo() })
  if (error) return FALHOU
  redirect(ROTA_INICIAL)
}

export async function salvarAjustes(entrada: unknown): Promise<Resultado> {
  const dados = esquemaAjustes.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  const usuario = await exigirUsuario()
  const { saldo, data, faixa1, faixa2, faixa3 } = dados.data

  const supabase = await criarClienteServidor()
  const { data: linhas, error } = await supabase
    .from('configuracoes')
    .update({ saldo_inicial_centavos: saldo, saldo_inicial_data: data, faixa_1: faixa1, faixa_2: faixa2, faixa_3: faixa3 })
    .eq('usuario_id', usuario.id)
    .select('usuario_id')
  if (error || !linhas.length) return FALHOU

  revalidatePath('/', 'layout') // saldo e faixas mudam todas as telas
  return { ok: true }
}

export async function criarCategoria(entrada: unknown): Promise<Resultado> {
  const dados = esquemaNovaCategoria.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  const usuario = await exigirUsuario()
  const { nome, grupo } = dados.data

  const supabase = await criarClienteServidor()
  // Entra no fim da lista do grupo.
  const { data: ultima } = await supabase
    .from('categorias')
    .select('ordem')
    .eq('usuario_id', usuario.id)
    .eq('grupo', grupo)
    .order('ordem', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase
    .from('categorias')
    .insert({ usuario_id: usuario.id, nome, grupo, ordem: (ultima?.ordem ?? 0) + 1 })
  if (error) return error.code === NOME_REPETIDO ? nomeRepetido(nome) : FALHOU

  revalidatePath('/ajustes')
  return { ok: true }
}

export async function renomearCategoria(entrada: unknown): Promise<Resultado> {
  const dados = esquemaRenomearCategoria.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()

  const supabase = await criarClienteServidor()
  const { data: linhas, error } = await supabase
    .from('categorias')
    .update({ nome: dados.data.nome })
    .eq('id', dados.data.id)
    .select('id')
  if (error) return error.code === NOME_REPETIDO ? nomeRepetido(dados.data.nome) : FALHOU
  if (!linhas.length) return SEM_CATEGORIA

  revalidatePath('/ajustes')
  return { ok: true }
}

/** Arquivada some dos formulários de lançamento, mas os lançamentos antigos continuam com ela. */
export async function arquivarCategoria(entrada: unknown): Promise<Resultado> {
  const dados = esquemaArquivarCategoria.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()

  const supabase = await criarClienteServidor()
  const { data: linhas, error } = await supabase
    .from('categorias')
    .update({ arquivada: dados.data.arquivada })
    .eq('id', dados.data.id)
    .select('id')
  if (error) return FALHOU
  if (!linhas.length) return SEM_CATEGORIA

  revalidatePath('/ajustes')
  return { ok: true }
}

/** Só apaga categoria sem lançamentos; com lançamentos, o banco recusa e sugerimos arquivar. */
export async function excluirCategoria(entrada: unknown): Promise<Resultado> {
  const dados = esquemaIdCategoria.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()

  const supabase = await criarClienteServidor()
  const { data: linhas, error } = await supabase.from('categorias').delete().eq('id', dados.data.id).select('id')
  if (error?.code === EM_USO) {
    return { ok: false, erro: 'Esta categoria tem lançamentos. Arquive para que ela saia dos formulários sem perder o histórico.' }
  }
  if (error) return FALHOU
  if (!linhas.length) return SEM_CATEGORIA

  revalidatePath('/ajustes')
  return { ok: true }
}

function nomeRepetido(nome: string): Resultado {
  return { ok: false, erro: `Já existe uma categoria "${nome}" neste grupo.` }
}
