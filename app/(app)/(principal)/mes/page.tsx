import type { Metadata } from 'next'
import { TelaMes } from '@/components/mes/TelaMes'
import { calcularDias, totaisDoMes } from '@/lib/calculo/saldo'
import { diaValido, diasDoMes, mesDe, mesValido } from '@/lib/calculo/calendario'
import { exigirConfiguracao, listarCategorias } from '@/lib/configuracao/dados'
import { carregarMes } from '@/lib/lancamentos/dados'
import { hojeEmSaoPaulo } from '@/lib/datas'

export const metadata: Metadata = { title: 'Mês' }

// /mes?m=2026-10&dia=2026-10-04. Sem ?m, abre o mês de hoje (ou o do ?dia).
export default async function PaginaMes({ searchParams }: PageProps<'/mes'>) {
  const params = await searchParams
  const texto = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined)
  const hoje = hojeEmSaoPaulo()
  const diaPedido = diaValido(texto(params.dia))
  const mes = mesValido(texto(params.m)) ?? (diaPedido ? mesDe(diaPedido) : mesDe(hoje))

  const dias = diasDoMes(mes)
  const [configuracao, categorias, { saldoAntes, lancamentos }] = await Promise.all([
    exigirConfiguracao(),
    listarCategorias(),
    carregarMes(dias[0], dias[dias.length - 1]),
  ])

  // O saldo é calculado aqui, a partir do saldo antes do dia 1 e dos lançamentos do mês.
  const movimentos = lancamentos.map(l => ({ data: l.data, tipo: l.tipo, valor: l.valor, reserva: l.reservaId !== null }))
  const calculados = calcularDias({ dias, saldoAntes, saldoInicialData: configuracao.saldoInicialData, movimentos })

  return (
    <TelaMes
      mes={mes}
      hoje={hoje}
      dias={calculados}
      lancamentos={lancamentos}
      totais={totaisDoMes(movimentos)}
      saldoAntes={saldoAntes}
      saldoInicial={configuracao.saldoInicial}
      saldoInicialData={configuracao.saldoInicialData}
      limites={configuracao.limites}
      categorias={categorias}
    />
  )
}
