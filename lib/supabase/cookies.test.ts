import { describe, expect, it } from 'vitest'
import { opcoesDoCookie } from './cookies'

describe('opcoesDoCookie', () => {
  const opcoes = { path: '/', sameSite: 'lax' as const, maxAge: 400 * 24 * 60 * 60 }

  it('mantém a validade quando a pessoa marcou "Manter conectado"', () => {
    expect(opcoesDoCookie(opcoes, false)).toEqual(opcoes)
  })

  it('tira a validade na sessão temporária (o cookie some ao fechar o navegador)', () => {
    expect(opcoesDoCookie(opcoes, true)).toEqual({ path: '/', sameSite: 'lax' })
  })

  it('continua apagando o cookie (maxAge 0) na sessão temporária', () => {
    expect(opcoesDoCookie({ path: '/', maxAge: 0 }, true)).toEqual({ path: '/', maxAge: 0 })
  })
})
