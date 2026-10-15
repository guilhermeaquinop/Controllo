// Para onde mandar cada requisição, conforme a pessoa está logada ou não.
// Função pura: o proxy.ts aplica, os testes conferem.

export const ROTA_INICIAL = '/mes'
export const ROTA_ENTRAR = '/entrar'

/** Telas só para quem não está logado: quem já entrou vai direto para o app. */
const SO_VISITANTE = ['/entrar', '/criar-conta', '/recuperar-senha']

/** Abertas a todos: o retorno dos links de e-mail precisa funcionar com ou sem sessão. */
const PUBLICAS = ['/auth/']

const comeca = (caminho: string, prefixo: string) =>
  prefixo.endsWith('/') ? caminho.startsWith(prefixo) : caminho === prefixo || caminho.startsWith(`${prefixo}/`)

/** Devolve o caminho para redirecionar, ou null para seguir. */
export function redirecionamento(caminho: string, logado: boolean): string | null {
  if (PUBLICAS.some(p => comeca(caminho, p))) return null
  if (caminho === '/') return logado ? ROTA_INICIAL : ROTA_ENTRAR
  if (SO_VISITANTE.some(p => comeca(caminho, p))) return logado ? ROTA_INICIAL : null
  return logado ? null : ROTA_ENTRAR
}

/** Aceita só caminhos internos ("/mes"), nunca "//site.com" ou "https://...". Evita redirecionamento aberto. */
export function destinoSeguro(destino: string | null | undefined, padrao = ROTA_INICIAL): string {
  if (!destino || !destino.startsWith('/') || destino.startsWith('//') || destino.startsWith('/\\')) return padrao
  return destino
}
