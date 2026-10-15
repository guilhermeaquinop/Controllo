import { describe, expect, it } from 'vitest'
import { casasAntes, diaDaSemana, diaPorExtenso, diaValido, diasDoMes, mesValido, nomeDoMes, somarMeses } from './calendario'

describe('calendário', () => {
  it('outubro de 2026 tem 31 dias e começa numa quinta (4 casas vazias)', () => {
    expect(diasDoMes('2026-10')).toHaveLength(31)
    expect(diasDoMes('2026-10')[0]).toBe('2026-10-01')
    expect(casasAntes('2026-10')).toBe(4)
  })

  it('conhece fevereiro em ano bissexto', () => {
    expect(diasDoMes('2028-02')).toHaveLength(29)
    expect(diasDoMes('2026-02')).toHaveLength(28)
  })

  it('anda entre meses e anos', () => {
    expect(somarMeses('2026-10', 1)).toBe('2026-11')
    expect(somarMeses('2026-12', 1)).toBe('2027-01')
    expect(somarMeses('2026-01', -1)).toBe('2025-12')
  })

  it('escreve datas em português', () => {
    expect(nomeDoMes('2026-10')).toBe('outubro de 2026')
    expect(diaPorExtenso('2026-10-04')).toBe('4 de outubro')
    expect(diaDaSemana('2026-10-04')).toBe('Domingo')
  })

  it('valida mês e dia vindos da URL', () => {
    expect(mesValido('2026-10')).toBe('2026-10')
    expect(mesValido('2026-13')).toBeNull()
    expect(mesValido('abc')).toBeNull()
    expect(diaValido('2026-02-29')).toBeNull()
    expect(diaValido('2028-02-29')).toBe('2028-02-29')
    expect(diaValido(null)).toBeNull()
  })
})
