import { describe, expect, it } from 'vitest'
import { esquemaAjustes, esquemaNovaCategoria, esquemaSaldoInicial } from './esquemas'

const ajustes = { saldo: '635,08', data: '2026-10-01', faixa1: '1.000', faixa2: '2.000', faixa3: '4.000' }

describe('esquemaSaldoInicial', () => {
  it('converte o saldo em centavos (mês de exemplo: R$ 635,08 em 01/10)', () => {
    expect(esquemaSaldoInicial.parse({ saldo: 'R$ 635,08', data: '2026-10-01' })).toEqual({ saldo: 63_508, data: '2026-10-01' })
  })

  it('aceita saldo zero e negativo', () => {
    expect(esquemaSaldoInicial.parse({ saldo: '0', data: '2026-10-01' }).saldo).toBe(0)
    expect(esquemaSaldoInicial.parse({ saldo: '−120,50', data: '2026-10-01' }).saldo).toBe(-12_050)
  })

  it('pede um valor e uma data válida', () => {
    const vazio = esquemaSaldoInicial.safeParse({ saldo: '', data: '' })
    expect(vazio.error?.issues.map(i => i.message)).toEqual(['Digite o saldo. Pode ser 0.', 'Escolha uma data.'])
    expect(esquemaSaldoInicial.safeParse({ saldo: '12,345', data: '2026-10-01' }).error?.issues[0].message).toBe('Digite um valor como 1.234,56.')
  })

  it('recusa data no futuro', () => {
    const r = esquemaSaldoInicial.safeParse({ saldo: '10', data: '2999-01-01' })
    expect(r.error?.issues[0].message).toBe('Use hoje ou um dia que já passou.')
  })
})

describe('esquemaAjustes', () => {
  it('lê as faixas digitadas como "1.000" em centavos', () => {
    expect(esquemaAjustes.parse(ajustes)).toEqual({ saldo: 63_508, data: '2026-10-01', faixa1: 100_000, faixa2: 200_000, faixa3: 400_000 })
  })

  it('exige faixas crescentes, apontando o campo errado', () => {
    const r = esquemaAjustes.safeParse({ ...ajustes, faixa2: '1.000' })
    expect(r.error?.issues).toMatchObject([{ path: ['faixa2'], message: 'Precisa ser maior que 1.000.' }])
    const r3 = esquemaAjustes.safeParse({ ...ajustes, faixa3: '1.500' })
    expect(r3.error?.issues).toMatchObject([{ path: ['faixa3'], message: 'Precisa ser maior que 2.000.' }])
  })

  it('recusa faixa zero ou negativa', () => {
    expect(esquemaAjustes.safeParse({ ...ajustes, faixa1: '0' }).error?.issues[0].message).toBe('Use um valor maior que zero.')
  })
})

describe('esquemaNovaCategoria', () => {
  it('tira espaços do nome e limita o grupo', () => {
    expect(esquemaNovaCategoria.parse({ nome: '  Pets ', grupo: 'saida' })).toEqual({ nome: 'Pets', grupo: 'saida' })
    expect(esquemaNovaCategoria.safeParse({ nome: 'Pets', grupo: 'diario' }).success).toBe(false)
    expect(esquemaNovaCategoria.safeParse({ nome: ' ', grupo: 'saida' }).error?.issues[0].message).toBe('Digite o nome.')
  })
})
