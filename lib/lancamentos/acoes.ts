'use server'
// Server Actions dos lançamentos (o "LancamentoController"). Cada uma confere o usuário,
// valida com Zod e grava com o cliente da sessão: o RLS garante que só mexe nas próprias linhas.
import { revalidatePath } from 'next/cache'
import { criarClienteServidor } from '@/lib/supabase/server'
import { exigirUsuario } from '@/lib/acesso/usuario'
import { ERRO_GENERICO } from '@/lib/acesso/mensagens'
import { NOME_GRUPO } from '@/lib/configuracao/esquemas'
import { DADOS_INVALIDOS, type Resultado } from '@/lib/resultado'
import type { TipoLancamento } from '@/lib/calculo/saldo'
import { esquemaEditarLancamento, esquemaIdLancamento, esquemaNovoLancamento, grupoDoTipo } from './esquemas'

const FALHOU: Resultado = { ok: false, erro: ERRO_GENERICO }
const SEM_LANCAMENTO: Resultado = { ok: false, erro: 'Lançamento não encontrado. Recarregue a página.' }

type Supabase = Awaited<ReturnType<typeof criarClienteServidor>>

/**
 * A categoria precisa ser do grupo do tipo (Entrada usa as de entrada; Saída e Diário, as de saída)
 * e estar ativa. Uma categoria arquivada só passa se o lançamento já estava nela (edição).
 */
async function conferirCategoria(supabase: Supabase, categoriaId: string, tipo: TipoLancamento, atual?: string | null) {
  const { data } = await supabase.from('categorias').select('grupo, arquivada').eq('id', categoriaId).maybeSingle()
  const grupo = grupoDoTipo(tipo)
  if (!data || data.grupo !== grupo) return `Escolha uma categoria de ${NOME_GRUPO[grupo].toLowerCase()}.`
  if (data.arquivada && categoriaId !== atual) return 'Esta categoria está arquivada. Escolha outra ou restaure em Ajustes.'
  return null
}

export async function criarLancamento(entrada: unknown): Promise<Resultado> {
  const dados = esquemaNovoLancamento.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  const usuario = await exigirUsuario()
  const { data, tipo, valor, categoriaId, descricao } = dados.data

  const supabase = await criarClienteServidor()
  const problema = await conferirCategoria(supabase, categoriaId, tipo)
  if (problema) return { ok: false, erro: problema }

  const { error } = await supabase.from('lancamentos').insert({
    usuario_id: usuario.id,
    data,
    tipo,
    valor_centavos: valor,
    categoria_id: categoriaId,
    descricao,
  })
  if (error) return FALHOU

  revalidatePath('/', 'layout') // o saldo muda no Mês, no Ano e no Resumo
  return { ok: true }
}

export async function editarLancamento(entrada: unknown): Promise<Resultado> {
  const dados = esquemaEditarLancamento.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()
  const { id, data, tipo, valor, categoriaId, descricao } = dados.data

  const supabase = await criarClienteServidor()
  const { data: atual } = await supabase.from('lancamentos').select('categoria_id').eq('id', id).maybeSingle()
  if (!atual) return SEM_LANCAMENTO
  const problema = await conferirCategoria(supabase, categoriaId, tipo, atual.categoria_id)
  if (problema) return { ok: false, erro: problema }

  // Etapa 6: lançamento de recorrência ou parcela também marca editado_manual / oferece editar o grupo.
  const { data: linhas, error } = await supabase
    .from('lancamentos')
    .update({ data, tipo, valor_centavos: valor, categoria_id: categoriaId, reserva_id: null, descricao })
    .eq('id', id)
    .select('id')
  if (error) return FALHOU
  if (!linhas.length) return SEM_LANCAMENTO

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function excluirLancamento(entrada: unknown): Promise<Resultado> {
  const dados = esquemaIdLancamento.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  await exigirUsuario()

  const supabase = await criarClienteServidor()
  const { data: linhas, error } = await supabase.from('lancamentos').delete().eq('id', dados.data.id).select('id')
  if (error) return FALHOU
  if (!linhas.length) return SEM_LANCAMENTO

  revalidatePath('/', 'layout')
  return { ok: true }
}
