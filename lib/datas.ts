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
