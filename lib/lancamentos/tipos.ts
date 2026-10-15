import type { TipoLancamento } from '@/lib/calculo/saldo'

/** Um lançamento como a tela recebe: valor em centavos (positivo) e o nome da categoria junto. */
export type Lancamento = {
  id: string
  data: string // 'YYYY-MM-DD'
  tipo: TipoLancamento
  valor: number
  descricao: string
  categoriaId: string | null
  categoria: string | null
  reservaId: string | null
  reserva: string | null
}

/** Título da linha na lista do dia: a descrição, ou o nome da categoria quando não há descrição. */
export function tituloDoLancamento(l: Pick<Lancamento, 'descricao' | 'categoria' | 'reserva'>): string {
  return l.descricao || l.categoria || l.reserva || 'Sem descrição'
}

/**
 * Última categoria usada em cada tipo (os lançamentos chegam em ordem de data e de criação).
 * Vira a categoria que já vem marcada no formulário.
 */
export function ultimasCategorias(lancamentos: Pick<Lancamento, 'tipo' | 'categoriaId'>[]): Partial<Record<TipoLancamento, string>> {
  const sugestoes: Partial<Record<TipoLancamento, string>> = {}
  for (const l of lancamentos) if (l.categoriaId) sugestoes[l.tipo] = l.categoriaId
  return sugestoes
}
