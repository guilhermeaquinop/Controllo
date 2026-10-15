// Datas do calendário do mês. Mês no formato 'YYYY-MM', dia 'YYYY-MM-DD'.
// Conta em UTC só para não depender do fuso da máquina: aqui não existe hora, só datas.

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const doisDigitos = (n: number) => String(n).padStart(2, '0')
const partes = (mes: string) => mes.split('-').map(Number) as [number, number]

export function mesValido(texto: string | null | undefined): string | null {
  if (!texto || !/^\d{4}-(0[1-9]|1[0-2])$/.test(texto)) return null
  const ano = Number(texto.slice(0, 4))
  return ano >= 1900 && ano <= 2999 ? texto : null
}

export function diaValido(texto: string | null | undefined): string | null {
  if (!texto || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return null
  const [a, m, d] = texto.split('-').map(Number)
  const data = new Date(Date.UTC(a, m - 1, d))
  return data.getUTCFullYear() === a && data.getUTCMonth() === m - 1 && data.getUTCDate() === d ? texto : null
}

export function mesDe(dia: string): string {
  return dia.slice(0, 7)
}

/** Todos os dias do mês, de 1 até 28–31. */
export function diasDoMes(mes: string): string[] {
  const [ano, m] = partes(mes)
  const total = new Date(Date.UTC(ano, m, 0)).getUTCDate()
  return Array.from({ length: total }, (_, i) => `${mes}-${doisDigitos(i + 1)}`)
}

/** Dia da semana do dia 1 (0 = domingo): quantas casas vazias antes dele no calendário. */
export function casasAntes(mes: string): number {
  const [ano, m] = partes(mes)
  return new Date(Date.UTC(ano, m - 1, 1)).getUTCDay()
}

export function somarMeses(mes: string, quantidade: number): string {
  const [ano, m] = partes(mes)
  const d = new Date(Date.UTC(ano, m - 1 + quantidade, 1))
  return `${d.getUTCFullYear()}-${doisDigitos(d.getUTCMonth() + 1)}`
}

/** "outubro de 2026" */
export function nomeDoMes(mes: string): string {
  const [ano, m] = partes(mes)
  return `${MESES[m - 1]} de ${ano}`
}

/** "outubro" */
export function nomeDoMesCurto(mes: string): string {
  return MESES[partes(mes)[1] - 1]
}

/** "4 de outubro" */
export function diaPorExtenso(dia: string): string {
  const [, m, d] = dia.split('-').map(Number)
  return `${d} de ${MESES[m - 1]}`
}

/** "Domingo" */
export function diaDaSemana(dia: string): string {
  const [a, m, d] = dia.split('-').map(Number)
  return SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()]
}
