// Faixa do saldo. Valores em centavos.
export type Faixa = 'negativo' | 'baixa' | 'media' | 'boa' | 'alta'

export type Limites = { faixa1: number; faixa2: number; faixa3: number }

export const LIMITES_PADRAO: Limites = { faixa1: 100_000, faixa2: 200_000, faixa3: 400_000 }

export function faixaDoSaldo(saldoCentavos: number, limites: Limites = LIMITES_PADRAO): Faixa {
  if (saldoCentavos < 0) return 'negativo'
  if (saldoCentavos < limites.faixa1) return 'baixa'
  if (saldoCentavos < limites.faixa2) return 'media'
  if (saldoCentavos < limites.faixa3) return 'boa'
  return 'alta'
}

// Classes do Tailwind para cada faixa (ver design/DESIGN.md).
export const CLASSE_FAIXA: Record<Faixa, string> = {
  negativo: 'bg-zone-negative text-on-zone-strong',
  baixa: 'bg-zone-low text-on-zone',
  media: 'bg-zone-mid text-on-zone',
  boa: 'bg-zone-ok text-on-zone',
  alta: 'bg-zone-high text-on-zone',
}
