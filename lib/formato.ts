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

/** Limite de faixa: "1.000" quando é redondo, "1.000,50" quando tem centavos. */
export function formatarLimite(centavos: number): string {
  return centavos % 100 === 0 ? formatarCurto(centavos) : formatarNumero(centavos)
}

/**
 * Converte o que a pessoa digitou em centavos, sem passar por float.
 * Aceita "1.234,56", "1234,5", "50", "R$ 635,08", "−300,00" e "1.000" (milhar, como no Brasil).
 * Sem vírgula, o ponto só vira decimal quando não forma grupos de milhar: "10.50" = R$ 10,50.
 * Mais de 2 casas decimais ou texto sem número devolve null.
 */
export function lerValor(texto: string): number | null {
  const limpo = texto.replace(/[−–]/g, '-').replace(/[^\d,.-]/g, '')
  if (!/\d/.test(limpo) || limpo.lastIndexOf('-') > 0) return null
  const negativo = limpo.startsWith('-')
  const corpo = limpo.replace('-', '')

  let inteiro: string
  let fracao: string
  if (corpo.includes(',')) {
    const partes = corpo.split(',')
    if (partes.length > 2) return null
    inteiro = partes[0].replace(/\./g, '')
    fracao = partes[1]
  } else if (/^\d{1,3}(\.\d{3})+$/.test(corpo)) {
    inteiro = corpo.replace(/\./g, '')
    fracao = ''
  } else {
    const partes = corpo.split('.')
    if (partes.length > 2) return null
    inteiro = partes[0]
    fracao = partes[1] ?? ''
  }

  if (!/^\d*$/.test(inteiro) || !/^\d{0,2}$/.test(fracao)) return null
  const centavos = Number(inteiro || '0') * 100 + Number(fracao.padEnd(2, '0'))
  if (!Number.isSafeInteger(centavos)) return null
  return negativo && centavos !== 0 ? -centavos : centavos
}
