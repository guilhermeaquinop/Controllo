// Formatação para a tela. Dinheiro sempre chega aqui em centavos inteiros.
const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

const MENOS = '−' // sinal de menos tipográfico

/** "R$ 3.627,09" (negativo: "−R$ 300,00") */
export function formatarReais(centavos: number): string {
  const s = reais.format(Math.abs(centavos) / 100).replace(/ /g, ' ')
  return centavos < 0 ? `${MENOS}${s}` : s
}

/** "+ R$ 6.450,00" ou "− R$ 1.800,00": valores de lançamento e performance */
export function formatarComSinal(centavos: number): string {
  return `${centavos < 0 ? MENOS : '+'} ${formatarReais(Math.abs(centavos))}`
}

/** "3.627,09": dentro de células e chips na web */
export function formatarNumero(centavos: number): string {
  return (centavos < 0 ? MENOS : '') + numero.format(Math.abs(centavos) / 100)
}

/** "3.627": chip do calendário no celular */
export function formatarCurto(centavos: number): string {
  return (centavos < 0 ? MENOS : '') + inteiro.format(Math.round(Math.abs(centavos) / 100))
}

/** Converte o que a pessoa digitou ("1.234,56", "1234,5", "50") em centavos. */
export function lerValor(texto: string): number | null {
  const limpo = texto.replace(/[^\d,.-]/g, '')
  if (!limpo) return null
  const normal = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo
  const n = Number(normal)
  return Number.isFinite(n) ? Math.round(n * 100) : null
}
