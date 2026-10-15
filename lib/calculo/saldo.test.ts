import { describe, expect, it } from 'vitest'
import { calcularDias, efeito, totaisDoMes, type Movimento } from './saldo'
import { diasDoMes } from './calendario'
import { lerValor } from '@/lib/formato'

// Mês de exemplo dos mockups (design/mockups/web/1-mes.dc.html): outubro de 2026,
// saldo inicial R$ 635,08 em 01/10. Valores por dia, em reais.
const ENTRADAS: Record<number, string> = { 3: '317', 4: '6450', 8: '7500', 12: '500', 15: '100', 18: '1000', 19: '934,50', 21: '1000', 24: '150', 29: '500', 30: '50' }
const SAIDAS: Record<number, string> = { 2: '200', 4: '3025,70', 8: '7831,54', 10: '46,73', 18: '200', 19: '1339,50' }
const DIARIO = ['0', '12,29', '437', '100', '799,50', '640,58', '336,29', '134', '94', '17', '275,06', '583,57', '356,74', '122,90', '10', '0', '159,90', '11', '467,18', '107', '119,49', '0', '84,70', '150', '214,75', '238,20', '142', '100', '62,99', '0', '0']

const centavos = (reais: string) => lerValor(reais)!
const dia = (d: number) => `2026-10-${String(d).padStart(2, '0')}`

const OUTUBRO: Movimento[] = [
  ...Object.entries(ENTRADAS).map(([d, v]) => ({ data: dia(+d), tipo: 'entrada' as const, valor: centavos(v) })),
  ...Object.entries(SAIDAS).map(([d, v]) => ({ data: dia(+d), tipo: 'saida' as const, valor: centavos(v) })),
  ...DIARIO.map((v, i) => ({ data: dia(i + 1), tipo: 'diario' as const, valor: centavos(v) })).filter(m => m.valor > 0),
]

// Saldo do fim de cada dia, como aparece nas células do mockup da web.
const SALDOS_DO_MOCKUP = [
  '635,08', '422,79', '302,79', '3.627,09', '2.827,59', '2.187,01', '1.850,72', '1.385,18', '1.291,18', '1.227,45',
  '952,39', '868,82', '512,08', '389,18', '479,18', '479,18', '319,28', '1.108,28', '236,10', '129,10',
  '1.009,61', '1.009,61', '924,91', '924,91', '710,16', '471,96', '329,96', '229,96', '666,97', '716,97', '716,97',
]

describe('calcularDias', () => {
  const dias = calcularDias({ dias: diasDoMes('2026-10'), saldoAntes: 63_508, saldoInicialData: '2026-10-01', movimentos: OUTUBRO })

  it('reproduz o saldo de cada dia do mês de exemplo', () => {
    expect(dias.map(d => d.saldo)).toEqual(SALDOS_DO_MOCKUP.map(centavos))
  })

  it('dia 4: R$ 3.627,09, com entrou, saiu e diário do dia', () => {
    expect(dias[3]).toEqual({ data: '2026-10-04', entradas: 645_000, saidas: 302_570, diario: 10_000, saldo: 362_709 })
  })

  it('deixa sem saldo os dias antes do saldo inicial, sem somar o que foi lançado neles', () => {
    const r = calcularDias({
      dias: ['2026-10-01', '2026-10-02', '2026-10-03'],
      saldoAntes: 10_000, // antes do saldo inicial, o banco devolve o próprio saldo inicial
      saldoInicialData: '2026-10-02',
      movimentos: [
        { data: '2026-10-01', tipo: 'saida', valor: 99_999 },
        { data: '2026-10-02', tipo: 'diario', valor: 1_000 },
        { data: '2026-10-03', tipo: 'entrada', valor: 500 },
      ],
    })
    expect(r.map(d => d.saldo)).toEqual([null, 9_000, 9_500])
    expect(r[0].saidas).toBe(99_999) // o movimento aparece no dia, só não entra no saldo
  })

  it('soma vários lançamentos do mesmo tipo no mesmo dia', () => {
    const r = calcularDias({
      dias: ['2026-10-01'],
      saldoAntes: 0,
      saldoInicialData: '2026-01-01',
      movimentos: [
        { data: '2026-10-01', tipo: 'diario', valor: 1_050 },
        { data: '2026-10-01', tipo: 'diario', valor: 2_000 },
        { data: '2026-10-01', tipo: 'entrada', valor: 100 },
      ],
    })
    expect(r[0]).toEqual({ data: '2026-10-01', entradas: 100, saidas: 0, diario: 3_050, saldo: -2_950 })
  })

  it('ignora movimentos fora do período', () => {
    const r = calcularDias({ dias: ['2026-10-01'], saldoAntes: 0, saldoInicialData: '2026-01-01', movimentos: [{ data: '2026-11-01', tipo: 'entrada', valor: 1 }] })
    expect(r[0].saldo).toBe(0)
  })
})

describe('totaisDoMes', () => {
  it('bate com os Dados gerais do mockup', () => {
    expect(totaisDoMes(OUTUBRO)).toEqual({
      entradas: 1_850_150,
      saidas: 1_264_347,
      diario: 577_614,
      saidaTotal: 1_841_961,
      performance: 8_189, // + R$ 81,89
      guardado: 0,
    })
  })

  it('conta aporte como saída na performance e mostra o guardado à parte', () => {
    const t = totaisDoMes([
      { data: '2026-10-01', tipo: 'entrada', valor: 500_000 },
      { data: '2026-10-05', tipo: 'saida', valor: 150_000, reserva: true }, // aporte
      { data: '2026-10-20', tipo: 'entrada', valor: 15_000, reserva: true }, // resgate
    ])
    expect(t.performance).toBe(500_000 + 15_000 - 150_000)
    expect(t.guardado).toBe(135_000)
  })
})

describe('efeito', () => {
  it('entrada soma; saída e diário subtraem', () => {
    expect(efeito({ tipo: 'entrada', valor: 100 })).toBe(100)
    expect(efeito({ tipo: 'saida', valor: 100 })).toBe(-100)
    expect(efeito({ tipo: 'diario', valor: 100 })).toBe(-100)
  })
})
