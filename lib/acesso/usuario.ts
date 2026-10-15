import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase/server'
import { ROTA_ENTRAR } from './rotas'

export type Usuario = { id: string; email: string }

/**
 * Quem está logado, validado pelo token (getClaims confere a assinatura).
 * Sem sessão, redireciona para Entrar. Como o Auth::user() + middleware auth do Laravel.
 * cache(): várias chamadas na mesma requisição leem a sessão uma vez só.
 */
export const exigirUsuario = cache(async (): Promise<Usuario> => {
  const supabase = await criarClienteServidor()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) redirect(ROTA_ENTRAR)
  return { id: claims.sub, email: typeof claims.email === 'string' ? claims.email : '' }
})

/** Endereço público do app, para os links dos e-mails. */
export async function urlDoSite(): Promise<string> {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL
  if (configurada) return configurada.replace(/\/$/, '')
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protocolo = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocolo}://${host}`
}
