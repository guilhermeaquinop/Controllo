import { describe, expect, it } from 'vitest'
import { destinoSeguro, redirecionamento } from './rotas'

describe('redirecionamento', () => {
  it('manda o visitante para Entrar nas telas do app', () => {
    expect(redirecionamento('/mes', false)).toBe('/entrar')
    expect(redirecionamento('/ajustes', false)).toBe('/entrar')
    expect(redirecionamento('/nova-senha', false)).toBe('/entrar')
    expect(redirecionamento('/', false)).toBe('/entrar')
  })

  it('deixa o visitante nas telas de acesso', () => {
    expect(redirecionamento('/entrar', false)).toBeNull()
    expect(redirecionamento('/criar-conta', false)).toBeNull()
    expect(redirecionamento('/recuperar-senha', false)).toBeNull()
  })

  it('manda quem está logado para o Mês ao abrir as telas de acesso', () => {
    expect(redirecionamento('/entrar', true)).toBe('/mes')
    expect(redirecionamento('/criar-conta', true)).toBe('/mes')
    expect(redirecionamento('/', true)).toBe('/mes')
  })

  it('deixa quem está logado no app e na nova senha', () => {
    expect(redirecionamento('/mes', true)).toBeNull()
    expect(redirecionamento('/nova-senha', true)).toBeNull()
  })

  it('não confunde prefixos parecidos', () => {
    expect(redirecionamento('/entrarx', true)).toBeNull()
    expect(redirecionamento('/entrarx', false)).toBe('/entrar')
  })

  it('libera o retorno dos links de e-mail para todos', () => {
    expect(redirecionamento('/auth/confirmar', false)).toBeNull()
    expect(redirecionamento('/auth/confirmar', true)).toBeNull()
  })
})

describe('destinoSeguro', () => {
  it('aceita caminhos internos', () => {
    expect(destinoSeguro('/nova-senha')).toBe('/nova-senha')
    expect(destinoSeguro('/mes?d=2026-10-04')).toBe('/mes?d=2026-10-04')
  })

  it('recusa endereços externos e vazios', () => {
    expect(destinoSeguro('https://golpe.com')).toBe('/mes')
    expect(destinoSeguro('//golpe.com')).toBe('/mes')
    expect(destinoSeguro('/\\golpe.com')).toBe('/mes')
    expect(destinoSeguro(null)).toBe('/mes')
    expect(destinoSeguro('')).toBe('/mes')
  })
})
