import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('mantém o tamanho do texto ao lado de uma cor', () => {
    expect(cn('text-label', 'text-money-in')).toBe('text-label text-money-in')
    expect(cn('rounded-sm text-chip', 'bg-zone-ok text-on-zone')).toBe('rounded-sm text-chip bg-zone-ok text-on-zone')
  })

  it('resolve conflito entre dois tamanhos da escala', () => {
    expect(cn('text-caption', 'text-chip')).toBe('text-chip')
  })
})
