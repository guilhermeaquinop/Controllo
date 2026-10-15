// Retorno dos links de e-mail (confirmar conta e nova senha). Route Handler = rota de API.
// Aceita os dois formatos do Supabase:
// - token_hash + type: modelos de e-mail do projeto (supabase/templates). Funciona em qualquer aparelho.
// - code: modelos padrão do Supabase (PKCE). Só funciona no mesmo navegador que pediu o link.
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { criarClienteServidor } from '@/lib/supabase/server'
import { ROTA_ENTRAR, destinoSeguro } from '@/lib/acesso/rotas'

const TIPOS: EmailOtpType[] = ['email', 'signup', 'recovery', 'invite', 'magiclink', 'email_change']

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tokenHash = params.get('token_hash')
  const tipo = params.get('type') as EmailOtpType | null
  const codigo = params.get('code')
  const padrao = tipo === 'recovery' ? '/nova-senha' : undefined
  const destino = destinoSeguro(params.get('next'), padrao)

  const supabase = await criarClienteServidor()
  let ok = false
  if (tokenHash && tipo && TIPOS.includes(tipo)) {
    ok = !(await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash })).error
  } else if (codigo) {
    ok = !(await supabase.auth.exchangeCodeForSession(codigo)).error
  }

  return NextResponse.redirect(new URL(ok ? destino : `${ROTA_ENTRAR}?erro=link`, request.url))
}
