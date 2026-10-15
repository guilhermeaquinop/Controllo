import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { redirecionamento } from '@/lib/acesso/rotas'
import { COOKIE_SESSAO_TEMPORARIA, opcoesDoCookie } from './cookies'
import { variaveisSupabase } from './env'
import type { Database } from './database.types'

/**
 * Roda antes de cada página (ver proxy.ts na raiz): renova o token da sessão, grava os
 * cookies novos e redireciona conforme a pessoa está logada ou não.
 * É uma checagem otimista; cada tela e cada Server Action confere o usuário de novo.
 */
export async function atualizarSessao(request: NextRequest) {
  const temporaria = request.cookies.has(COOKIE_SESSAO_TEMPORARIA)
  const { url, chave } = variaveisSupabase()
  let resposta = NextResponse.next({ request })

  const supabase = createServerClient<Database>(url, chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(lista, cabecalhos) {
        for (const { name, value } of lista) request.cookies.set(name, value)
        resposta = NextResponse.next({ request })
        for (const { name, value, options } of lista) resposta.cookies.set(name, value, opcoesDoCookie(options, temporaria))
        for (const [nome, valor] of Object.entries(cabecalhos ?? {})) resposta.headers.set(nome, valor)
      },
    },
  })

  // Não coloque código entre criar o cliente e getClaims(): é aqui que o token é renovado.
  const { data } = await supabase.auth.getClaims()
  const logado = Boolean(data?.claims?.sub)

  const destino = redirecionamento(request.nextUrl.pathname, logado)
  if (!destino) return resposta

  const redirecionar = NextResponse.redirect(new URL(destino, request.url))
  // Leva junto os cookies renovados, senão a sessão se perde no redirecionamento.
  for (const cookie of resposta.cookies.getAll()) redirecionar.cookies.set(cookie)
  return redirecionar
}
