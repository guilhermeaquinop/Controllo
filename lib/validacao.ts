// Peças de validação usadas por vários esquemas Zod.
import { z } from 'zod'
import { lerValor } from '@/lib/formato'

/** R$ 1 bilhão: acima disso é erro de digitação. */
const TETO_CENTAVOS = 100_000_000_000

/** Campo de dinheiro: chega como texto ("1.234,56", "1.000") e sai em centavos inteiros. */
export function dinheiro(mensagemVazio: string) {
  return z.string().transform((texto, ctx) => {
    if (!texto.trim()) {
      ctx.addIssue({ code: 'custom', message: mensagemVazio })
      return z.NEVER
    }
    const centavos = lerValor(texto)
    if (centavos === null) {
      ctx.addIssue({ code: 'custom', message: 'Digite um valor como 1.234,56.' })
      return z.NEVER
    }
    if (Math.abs(centavos) > TETO_CENTAVOS) {
      ctx.addIssue({ code: 'custom', message: 'Valor alto demais. Confira os dígitos.' })
      return z.NEVER
    }
    return centavos
  })
}
