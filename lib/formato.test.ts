import { describe, expect, it } from 'vitest'
import { formatarComSinal, formatarCurto, formatarLimite, formatarNumero, formatarReais, lerValor } from './formato'

describe('lerValor', () => {
  it('lê valores com vírgula decimal', () => {
    expect(lerValor('635,08')).toBe(63_508)
    expect(lerValor('1.234,56')).toBe(123_456)
    expect(lerValor('1234,5')).toBe(123_450)
    expect(lerValor('R$ 3.627,09')).toBe(362_709)
    expect(lerValor(',5')).toBe(50)
  })

  it('lê o ponto como milhar quando forma grupos de 3', () => {
    expect(lerValor('1.000')).toBe(100_000)
    expect(lerValor('4.000')).toBe(400_000)
    expect(lerValor('1.234.567')).toBe(123_456_700)
  })

  it('lê o ponto como decimal quando não é milhar', () => {
    expect(lerValor('10.50')).toBe(1_050)
    expect(lerValor('1.5')).toBe(150)
    expect(lerValor('50')).toBe(5_000)
  })

  it('aceita negativo com hífen ou com o sinal de menos tipográfico', () => {
    expect(lerValor('-300')).toBe(-30_000)
    expect(lerValor('−300,00')).toBe(-30_000)
    expect(lerValor(formatarNumero(-63_508))).toBe(-63_508)
    expect(lerValor('-0')).toBe(0)
  })

  it('recusa o que não é valor', () => {
    expect(lerValor('')).toBeNull()
    expect(lerValor('abc')).toBeNull()
    expect(lerValor('1,005')).toBeNull()
    expect(lerValor('1,2,3')).toBeNull()
    expect(lerValor('1.2.3')).toBeNull()
    expect(lerValor('12-3')).toBeNull()
  })

  it('não usa float: 0,07 vira 7 centavos exatos', () => {
    expect(lerValor('0,07')).toBe(7)
    expect(lerValor('1,10')).toBe(110)
  })
})

describe('formatação', () => {
  it('formata reais, sinais e números como nos mockups', () => {
    expect(formatarReais(63_508)).toBe('R$ 635,08')
    expect(formatarReais(-30_000)).toBe('−R$ 300,00')
    expect(formatarComSinal(8_189)).toBe('+ R$ 81,89')
    expect(formatarComSinal(-180_000)).toBe('− R$ 1.800,00')
    expect(formatarNumero(362_709)).toBe('3.627,09')
    expect(formatarCurto(362_709)).toBe('3.627')
  })

  it('formata limites de faixa sem centavos quando redondos', () => {
    expect(formatarLimite(100_000)).toBe('1.000')
    expect(formatarLimite(150_050)).toBe('1.500,50')
  })
})
