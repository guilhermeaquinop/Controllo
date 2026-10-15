// O que uma Server Action devolve quando não redireciona.
export type Resultado = { ok: true } | { ok: false; erro: string }

/** O formulário já valida no navegador; isto só aparece se alguém mandar dados por fora dele. */
export const DADOS_INVALIDOS: Resultado = { ok: false, erro: 'Confira os campos e tente de novo.' }
