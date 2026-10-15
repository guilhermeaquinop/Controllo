import { describe, expect, it } from 'vitest'
import { esquemaNovoLancamento, grupoDoTipo } from './esquemas'

const base = { data: '2026-10-04', tipo: 'diario', valor: '100', categoriaId: '7c9e6679-7425-40de-944b-e07fc1f90ae7', descricao: ' Combustível ' }

describe('esquemaNovoLancamento', () => {
  it('converte o valor em centavos e limpa a descrição', () => {
    expect(esquemaNovoLancamento.parse(base)).toEqual({ ...base, valor: 10_000, descricao: 'Combustível' })
  })

  it('aceita data no futuro (lançamento previsto)', () => {
    expect(esquemaNovoLancamento.safeParse({ ...base, data: '2027-03-10' }).success).toBe(true)
  })

  it('recusa valor zero, negativo ou vazio', () => {
    const mensagem = (valor: string) => esquemaNovoLancamento.safeParse({ ...base, valor }).error?.issues[0].message
    expect(mensagem('0')).toBe('Use um valor maior que zero.')
    expect(mensagem('-10')).toBe('Use um valor maior que zero.')
    expect(mensagem('')).toBe('Digite o valor.')
  })

  it('pede uma categoria e um tipo conhecido', () => {
    expect(esquemaNovoLancamento.safeParse({ ...base, categoriaId: '' }).error?.issues[0].message).toBe('Escolha uma categoria.')
    expect(esquemaNovoLancamento.safeParse({ ...base, tipo: 'transferencia' }).success).toBe(false)
  })

  it('limita a descrição a 80 caracteres', () => {
    expect(esquemaNovoLancamento.safeParse({ ...base, descricao: 'a'.repeat(81) }).success).toBe(false)
  })
})

describe('grupoDoTipo', () => {
  it('Saída e Diário usam as categorias de saída', () => {
    expect(grupoDoTipo('entrada')).toBe('entrada')
    expect(grupoDoTipo('saida')).toBe('saida')
    expect(grupoDoTipo('diario')).toBe('saida')
  })
})
