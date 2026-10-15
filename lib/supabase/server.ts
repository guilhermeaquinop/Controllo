import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { COOKIE_SESSAO_TEMPORARIA, opcoesDoCookie } from './cookies'
import { variaveisSupabase } from './env'
import type { Database } from './database.types'

/**
 * Cliente do Supabase para Server Components, Server Actions e Route Handlers.
 * Usa a sessão de quem está logado, então o RLS vale em toda consulta.
 * Crie um por requisição (não guarde em variável de módulo).
 */
export async function criarClienteServidor(opcoes?: { sessaoTemporaria?: boolean }) {
  const loja = await cookies()
  const temporaria = opcoes?.sessaoTemporaria ?? loja.has(COOKIE_SESSAO_TEMPORARIA)
  const { url, chave } = variaveisSupabase()

  return createServerClient<Database>(url, chave, {
    cookies: {
      getAll: () => loja.getAll(),
      setAll(lista) {
        try {
          for (const { name, value, options } of lista) loja.set(name, value, opcoesDoCookie(options, temporaria))
        } catch {
          // Server Component não grava cookie. Tudo bem: o proxy.ts renova a sessão a cada navegação.
        }
      },
    },
  })
}
