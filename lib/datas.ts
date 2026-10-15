// Datas do app: sempre 'YYYY-MM-DD' (o tipo date do Postgres, sem hora) e "hoje" no fuso de São Paulo.
import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'

export const FUSO = 'America/Sao_Paulo'

/** Hoje em São Paulo, como 'YYYY-MM-DD'. Nunca use o fuso do servidor (a Vercel roda em UTC). */
export function hojeEmSaoPaulo(agora: Date = new Date()): string {
  return format(TZDate.tz(FUSO, agora), 'yyyy-MM-dd')
}

/** '2026-10-01' → '01/10/2026' */
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

/** Máscara do campo de data enquanto a pessoa digita: "01102026" → "01/10/2026". */
export function mascararData(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/** '01/10/2026' → '2026-10-01'. Data que não existe (31/02) ou incompleta devolve null. */
export function lerData(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim())
  if (!m) return null
  const [, dia, mes, ano] = m
  const data = new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)))
  const valida = data.getUTCFullYear() === Number(ano) && data.getUTCMonth() === Number(mes) - 1 && data.getUTCDate() === Number(dia)
  return valida ? `${ano}-${mes}-${dia}` : null
}
