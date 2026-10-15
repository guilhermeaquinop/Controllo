'use server'
// Server Actions de acesso. Equivalem aos métodos de um AuthController do Laravel:
// validam com Zod (mesmo que o formulário já tenha validado) e falam com o Supabase Auth.
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase/server'
import { COOKIE_SESSAO_TEMPORARIA } from '@/lib/supabase/cookies'
import {
  esquemaCriarConta,
  esquemaEntrar,
  esquemaNovaSenha,
  esquemaRecuperarSenha,
} from './esquemas'
import { DADOS_INVALIDOS, type Resultado } from '@/lib/resultado'
import { mensagemDeErroAuth } from './mensagens'
import { ROTA_ENTRAR, ROTA_INICIAL } from './rotas'
import { urlDoSite } from './usuario'

export async function entrar(entrada: unknown): Promise<Resultado> {
  const dados = esquemaEntrar.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  const { email, senha, manterConectado } = dados.data

  const supabase = await criarClienteServidor({ sessaoTemporaria: !manterConectado })
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) return { ok: false, erro: mensagemDeErroAuth(error.code) }

  const loja = await cookies()
  if (manterConectado) loja.delete(COOKIE_SESSAO_TEMPORARIA)
  else loja.set(COOKIE_SESSAO_TEMPORARIA, '1', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })

  redirect(ROTA_INICIAL)
}

export async function criarConta(entrada: unknown): Promise<Resultado> {
  const dados = esquemaCriarConta.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS
  const { nome, email, senha } = dados.data

  const supabase = await criarClienteServidor()
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome }, // vira o nome em public.perfis (trigger da migration 0002)
      emailRedirectTo: `${await urlDoSite()}/auth/confirmar?next=${ROTA_INICIAL}`,
    },
  })
  if (error) return { ok: false, erro: mensagemDeErroAuth(error.code) }
  // Se o e-mail já tiver conta, o Supabase responde igual e não manda nada:
  // assim ninguém descobre quais e-mails estão cadastrados.
  return { ok: true }
}

export async function recuperarSenha(entrada: unknown): Promise<Resultado> {
  const dados = esquemaRecuperarSenha.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS

  const supabase = await criarClienteServidor()
  const { error } = await supabase.auth.resetPasswordForEmail(dados.data.email, {
    redirectTo: `${await urlDoSite()}/auth/confirmar?next=/nova-senha`,
  })
  // Só mostramos erro de limite de envio; o resto responde igual, com ou sem conta.
  if (error?.code === 'over_email_send_rate_limit' || error?.code === 'over_request_rate_limit') {
    return { ok: false, erro: mensagemDeErroAuth(error.code) }
  }
  return { ok: true }
}

export async function definirNovaSenha(entrada: unknown): Promise<Resultado> {
  const dados = esquemaNovaSenha.safeParse(entrada)
  if (!dados.success) return DADOS_INVALIDOS

  const supabase = await criarClienteServidor()
  const { error } = await supabase.auth.updateUser({ password: dados.data.senha })
  if (error) return { ok: false, erro: mensagemDeErroAuth(error.code) }

  redirect(ROTA_INICIAL)
}

export async function sair(): Promise<void> {
  const supabase = await criarClienteServidor()
  await supabase.auth.signOut({ scope: 'local' })
  ;(await cookies()).delete(COOKIE_SESSAO_TEMPORARIA)
  redirect(ROTA_ENTRAR)
}
