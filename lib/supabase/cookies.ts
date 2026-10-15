import type { CookieOptions } from '@supabase/ssr'

/**
 * "Manter conectado" desmarcado: este cookie (sem validade, some ao fechar o navegador)
 * avisa que os cookies da sessão também devem ser temporários.
 */
export const COOKIE_SESSAO_TEMPORARIA = 'controllo-sessao-temporaria'

/** Tira a validade dos cookies da sessão quando ela é temporária. Apagar (maxAge 0) continua apagando. */
export function opcoesDoCookie(options: CookieOptions, temporaria: boolean): CookieOptions {
  if (!temporaria || options.maxAge === 0) return options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { maxAge, expires, ...resto } = options
  return resto
}
