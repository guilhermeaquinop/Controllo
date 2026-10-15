import { describe, expect, it } from 'vitest'
import { formatarData, hojeEmSaoPaulo, lerData, mascararData } from './datas'

describe('hojeEmSaoPaulo', () => {
  it('usa o fuso de São Paulo, não o UTC', () => {
    // 01:30 UTC do dia 16 ainda é 22:30 do dia 15 em São Paulo
    expect(hojeEmSaoPaulo(new Date('2026-10-16T01:30:00Z'))).toBe('2026-10-15')
    expect(hojeEmSaoPaulo(new Date('2026-10-16T03:00:00Z'))).toBe('2026-10-16')
  })

  it('vira o ano à meia-noite de São Paulo', () => {
    expect(hojeEmSaoPaulo(new Date('2027-01-01T02:59:59Z'))).toBe('2026-12-31')
    expect(hojeEmSaoPaulo(new Date('2027-01-01T03:00:00Z'))).toBe('2027-01-01')
  })
})

describe('formatarData', () => {
  it('mostra dd/mm/aaaa', () => {
    expect(formatarData('2026-10-01')).toBe('01/10/2026')
  })
})

describe('mascararData', () => {
  it('põe as barras enquanto a pessoa digita', () => {
    expect(mascararData('0')).toBe('0')
    expect(mascararData('011')).toBe('01/1')
    expect(mascararData('01102026')).toBe('01/10/2026')
    expect(mascararData('01/10/2026')).toBe('01/10/2026')
    expect(mascararData('011020261')).toBe('01/10/2026')
    expect(mascararData('ab01')).toBe('01')
  })
})

describe('lerData', () => {
  it('converte dd/mm/aaaa para o formato do banco', () => {
    expect(lerData('01/10/2026')).toBe('2026-10-01')
    expect(lerData('29/02/2028')).toBe('2028-02-29')
  })

  it('recusa data incompleta ou que não existe', () => {
    expect(lerData('01/10/26')).toBeNull()
    expect(lerData('31/02/2026')).toBeNull()
    expect(lerData('29/02/2026')).toBeNull()
    expect(lerData('')).toBeNull()
  })
})
