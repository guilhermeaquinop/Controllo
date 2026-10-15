// Saldo do fim de cada dia e totais do mês. Funções puras: tudo em centavos inteiros
// e datas 'YYYY-MM-DD' (comparar texto nesse formato é comparar datas).

export type TipoLancamento = 'entrada' | 'saida' | 'diario'

/** O mínimo de um lançamento que o cálculo precisa. */
export type Movimento = {
  data: string
  tipo: TipoLancamento
  valor: number // centavos, sempre positivo
  /** Ligado a uma reserva: aporte (saída) ou resgate (entrada). */
  reserva?: boolean
}

export type DiaCalculado = {
  data: string
  entradas: number
  saidas: number
  diario: number
  /** Saldo no fim do dia; null antes da data do saldo inicial. */
  saldo: number | null
}

/** Entrada soma; Saída e Diário subtraem. */
export function efeito(m: Pick<Movimento, 'tipo' | 'valor'>): number {
  return m.tipo === 'entrada' ? m.valor : -m.valor
}

type EntradaDias = {
  /** Dias do período, em ordem. */
  dias: string[]
  /**
   * Saldo no começo do primeiro dia: saldo_antes_de(dias[0]) no banco.
   * Se o período começa antes do saldo inicial, é o próprio saldo inicial.
   */
  saldoAntes: number
  saldoInicialData: string
  movimentos: Movimento[]
}

/**
 * Saldo do fim de cada dia do período: saldo do dia anterior + entradas − saídas − diário.
 * Dias antes do saldo inicial ficam sem saldo (mostram "—") e não mexem no saldo corrido.
 */
export function calcularDias({ dias, saldoAntes, saldoInicialData, movimentos }: EntradaDias): DiaCalculado[] {
  const porDia = new Map<string, Movimento[]>()
  for (const m of movimentos) porDia.set(m.data, [...(porDia.get(m.data) ?? []), m])

  let corrido = saldoAntes
  return dias.map(data => {
    const doDia = porDia.get(data) ?? []
    const soma = (tipo: TipoLancamento) => doDia.filter(m => m.tipo === tipo).reduce((t, m) => t + m.valor, 0)
    const dia = { data, entradas: soma('entrada'), saidas: soma('saida'), diario: soma('diario') }
    if (data < saldoInicialData) return { ...dia, saldo: null }
    corrido += dia.entradas - dia.saidas - dia.diario
    return { ...dia, saldo: corrido }
  })
}

export type TotaisDoMes = {
  entradas: number
  saidas: number
  diario: number
  /** Saídas + Diário */
  saidaTotal: number
  /** Entradas − Saída total. Aporte em reserva conta como saída (como na planilha). */
  performance: number
  /** Aportes − resgates, mostrado à parte. */
  guardado: number
}

export function totaisDoMes(movimentos: Movimento[]): TotaisDoMes {
  const soma = (filtro: (m: Movimento) => boolean) => movimentos.filter(filtro).reduce((t, m) => t + m.valor, 0)
  const entradas = soma(m => m.tipo === 'entrada')
  const saidas = soma(m => m.tipo === 'saida')
  const diario = soma(m => m.tipo === 'diario')
  const saidaTotal = saidas + diario
  const aportes = soma(m => m.tipo === 'saida' && !!m.reserva)
  const resgates = soma(m => m.tipo === 'entrada' && !!m.reserva)
  return { entradas, saidas, diario, saidaTotal, performance: entradas - saidaTotal, guardado: aportes - resgates }
}
