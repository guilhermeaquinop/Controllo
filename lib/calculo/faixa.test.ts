import { describe, expect, it } from 'vitest'
import { faixaDoSaldo } from './faixa'

describe('faixaDoSaldo', () => {
  it('usa os limites padrão de 1.000, 2.000 e 4.000', () => {
    expect(faixaDoSaldo(-1)).toBe('negativo')
    expect(faixaDoSaldo(0)).toBe('baixa')
    expect(faixaDoSaldo(99_999)).toBe('baixa')
    expect(faixaDoSaldo(100_000)).toBe('media')
    expect(faixaDoSaldo(199_999)).toBe('media')
    expect(faixaDoSaldo(200_000)).toBe('boa')
    expect(faixaDoSaldo(399_999)).toBe('boa')
    expect(faixaDoSaldo(400_000)).toBe('alta')
  })

  it('bate com o mês de exemplo dos mockups', () => {
    expect(faixaDoSaldo(362_709)).toBe('boa')    // 4/10: R$ 3.627,09
    expect(faixaDoSaldo(185_072)).toBe('media')  // 7/10: R$ 1.850,72
    expect(faixaDoSaldo(12_910)).toBe('baixa')   // 20/10: R$ 129,10
  })
})
