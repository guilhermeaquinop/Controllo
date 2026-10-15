import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase/server'
import { exigirUsuario } from '@/lib/acesso/usuario'
import type { Limites } from '@/lib/calculo/faixa'
import type { Categoria } from './esquemas'

export type { Categoria }

export const ROTA_PRIMEIRO_ACESSO = '/primeiro-acesso'

export type Configuracao = {
  saldoInicial: number // centavos
  saldoInicialData: string // 'YYYY-MM-DD'
  limites: Limites
  previsaoContaDiario: boolean
}

/** Configurações de quem está logado, ou null se ainda não passou pelo Primeiro acesso. */
export const obterConfiguracao = cache(async (): Promise<Configuracao | null> => {
  const usuario = await exigirUsuario()
  const supabase = await criarClienteServidor()
  const { data, error } = await supabase
    .from('configuracoes')
    .select('saldo_inicial_centavos, saldo_inicial_data, faixa_1, faixa_2, faixa_3, previsao_conta_diario')
    .eq('usuario_id', usuario.id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    saldoInicial: data.saldo_inicial_centavos,
    saldoInicialData: data.saldo_inicial_data,
    limites: { faixa1: data.faixa_1, faixa2: data.faixa_2, faixa3: data.faixa_3 },
    previsaoContaDiario: data.previsao_conta_diario,
  }
})

/** Como obterConfiguracao, mas manda para o Primeiro acesso quem ainda não tem. */
export async function exigirConfiguracao(): Promise<Configuracao> {
  const configuracao = await obterConfiguracao()
  if (!configuracao) redirect(ROTA_PRIMEIRO_ACESSO)
  return configuracao
}

/** Categorias na ordem de exibição: ativas primeiro, depois as arquivadas. */
export async function listarCategorias(): Promise<Categoria[]> {
  const usuario = await exigirUsuario()
  const supabase = await criarClienteServidor()
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome, grupo, arquivada')
    .eq('usuario_id', usuario.id)
    .order('arquivada')
    .order('ordem')
    .order('nome')
  if (error) throw error
  return data
}
