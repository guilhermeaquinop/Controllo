import { describe, expect, it } from 'vitest'
import { esquemaCriarConta, esquemaEntrar, esquemaNovaSenha } from './esquemas'
import { ERRO_GENERICO, mensagemDeErroAuth } from './mensagens'

describe('esquemas de acesso', () => {
  it('tira os espaços do e-mail', () => {
    const r = esquemaEntrar.parse({ email: '  voce@email.com ', senha: 'x', manterConectado: true })
    expect(r.email).toBe('voce@email.com')
  })

  it('recusa e-mail inválido com mensagem em português', () => {
    const r = esquemaEntrar.safeParse({ email: 'voce@', senha: 'x', manterConectado: true })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('Digite um e-mail válido.')
  })

  it('pede senha de 8 a 72 caracteres no cadastro', () => {
    const base = { nome: 'Guilherme', email: 'voce@email.com' }
    expect(esquemaCriarConta.safeParse({ ...base, senha: '1234567' }).success).toBe(false)
    expect(esquemaCriarConta.safeParse({ ...base, senha: '12345678' }).success).toBe(true)
    expect(esquemaCriarConta.safeParse({ ...base, senha: 'a'.repeat(73) }).success).toBe(false)
  })

  it('recusa nome vazio', () => {
    const r = esquemaCriarConta.safeParse({ nome: '   ', email: 'voce@email.com', senha: '12345678' })
    expect(r.error?.issues[0].message).toBe('Digite seu nome.')
  })

  it('confere a confirmação da nova senha', () => {
    const r = esquemaNovaSenha.safeParse({ senha: '12345678', confirmacao: '12345679' })
    expect(r.error?.issues[0].path).toEqual(['confirmacao'])
    expect(esquemaNovaSenha.safeParse({ senha: '12345678', confirmacao: '12345678' }).success).toBe(true)
  })
})

describe('mensagemDeErroAuth', () => {
  it('traduz os códigos conhecidos', () => {
    expect(mensagemDeErroAuth('invalid_credentials')).toBe('E-mail ou senha incorretos.')
  })

  it('cai na mensagem genérica sem código ou com código desconhecido', () => {
    expect(mensagemDeErroAuth(undefined)).toBe(ERRO_GENERICO)
    expect(mensagemDeErroAuth('qualquer_coisa')).toBe(ERRO_GENERICO)
  })
})
