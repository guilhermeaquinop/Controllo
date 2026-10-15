import 'server-only'
import { criarClienteServidor } from '@/lib/supabase/server'
import { exigirUsuario } from '@/lib/acesso/usuario'
import type { Lancamento } from './tipos'

export type DadosDoMes = {
  /** Saldo no começo do dia 1 (saldo_antes_de no banco). */
  saldoAntes: number
  lancamentos: Lancamento[]
}

/**
 * Tudo o que a tela do mês precisa do banco: o saldo antes do dia 1 (uma soma agregada)
 * e os lançamentos do mês. O saldo de cada dia é calculado em lib/calculo/saldo.ts.
 */
export async function carregarMes(primeiroDia: string, ultimoDia: string): Promise<DadosDoMes> {
  const usuario = await exigirUsuario()
  const supabase = await criarClienteServidor()

  const [saldo, lista] = await Promise.all([
    supabase.rpc('saldo_antes_de', { p_data: primeiroDia }),
    supabase
      .from('lancamentos')
      .select('id, data, tipo, valor_centavos, descricao, categoria_id, reserva_id, categorias(nome), reservas(nome)')
      .eq('usuario_id', usuario.id)
      .gte('data', primeiroDia)
      .lte('data', ultimoDia)
      .order('data')
      .order('criado_em'),
  ])
  if (saldo.error) throw saldo.error
  if (lista.error) throw lista.error

  return {
    saldoAntes: saldo.data ?? 0,
    lancamentos: lista.data.map(l => ({
      id: l.id,
      data: l.data,
      tipo: l.tipo,
      valor: l.valor_centavos,
      descricao: l.descricao,
      categoriaId: l.categoria_id,
      categoria: l.categorias?.nome ?? null,
      reservaId: l.reserva_id,
      reserva: l.reservas?.nome ?? null,
    })),
  }
}
