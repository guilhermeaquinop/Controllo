import { describe, expect, it } from 'vitest'
import { formatarData, hojeEmSaoPaulo } from './datas'

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
