// Esquemas Zod das telas de acesso. Os mesmos validam o formulário (navegador)
// e a Server Action (servidor), como um Form Request do Laravel.
import { z } from 'zod'

const email = z.string().trim().pipe(z.email({ error: 'Digite um e-mail válido.' }))

// O Supabase usa bcrypt, que só considera os primeiros 72 bytes.
const senhaNova = z
  .string()
  .min(8, { error: 'Use pelo menos 8 caracteres.' })
  .max(72, { error: 'Use até 72 caracteres.' })

export const esquemaEntrar = z.object({
  email,
  senha: z.string().min(1, { error: 'Digite a senha.' }),
  manterConectado: z.boolean(),
})

export const esquemaCriarConta = z.object({
  nome: z.string().trim().min(1, { error: 'Digite seu nome.' }).max(80, { error: 'Use até 80 caracteres.' }),
  email,
  senha: senhaNova,
})

export const esquemaRecuperarSenha = z.object({ email })

export const esquemaNovaSenha = z
  .object({ senha: senhaNova, confirmacao: z.string() })
  .refine(d => d.senha === d.confirmacao, { error: 'As senhas não são iguais.', path: ['confirmacao'] })

export type DadosEntrar = z.input<typeof esquemaEntrar>
export type DadosCriarConta = z.input<typeof esquemaCriarConta>
export type DadosRecuperarSenha = z.input<typeof esquemaRecuperarSenha>
export type DadosNovaSenha = z.input<typeof esquemaNovaSenha>
