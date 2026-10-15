import type { NextRequest } from 'next/server'
import { atualizarSessao } from '@/lib/supabase/proxy'

// O "middleware" do Next (no Next 16 se chama proxy). Equivale a um Middleware do Laravel
// aplicado a todas as rotas, exceto arquivos estáticos.
export async function proxy(request: NextRequest) {
  return atualizarSessao(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|brand/|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
