import { describe, expect, it } from 'vitest'
import { tituloDoLancamento, ultimasCategorias } from './tipos'

describe('ultimasCategorias', () => {
  it('guarda a última categoria de cada tipo', () => {
    expect(
      ultimasCategorias([
        { tipo: 'diario', categoriaId: 'mercado' },
        { tipo: 'saida', categoriaId: 'moradia' },
        { tipo: 'diario', categoriaId: 'transporte' },
        { tipo: 'entrada', categoriaId: null }, // resgate de reserva: sem categoria
      ]),
    ).toEqual({ diario: 'transporte', saida: 'moradia' })
  })
})

describe('tituloDoLancamento', () => {
  it('usa a descrição e, sem ela, a categoria', () => {
    expect(tituloDoLancamento({ descricao: 'Aluguel', categoria: 'Moradia', reserva: null })).toBe('Aluguel')
    expect(tituloDoLancamento({ descricao: '', categoria: 'Moradia', reserva: null })).toBe('Moradia')
    expect(tituloDoLancamento({ descricao: '', categoria: null, reserva: 'Viagem' })).toBe('Viagem')
  })
})
