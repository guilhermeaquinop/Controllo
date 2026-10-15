'use client'
// Dados gerais do mês. Celular: cartão com a performance em destaque e os totais em 2 colunas.
// Web: faixa única com as métricas lado a lado.
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { TotaisDoMes } from '@/lib/calculo/saldo'
import { Dinheiro } from '@/components/dinheiro/Dinheiro'

export function DadosGerais({ totais }: { totais: TotaisDoMes }) {
  const metricas = [
    { rotulo: 'Entradas', valor: totais.entradas },
    { rotulo: 'Saídas', valor: totais.saidas },
    { rotulo: 'Diário', valor: totais.diario },
    { rotulo: 'Saída total', valor: totais.saidaTotal },
  ]

  return (
    <section aria-label="Dados gerais" className="rounded-lg border border-border bg-surface">
      {/* Celular */}
      <div className="flex flex-col gap-4 p-5 lg:hidden">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-section">Dados gerais</h2>
          <Link href="/resumo" className="font-semibold underline underline-offset-2">Ver resumo</Link>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-ink-muted">Performance do mês</span>
          <Dinheiro centavos={totais.performance} modo="sinal" className="text-[34px] leading-tight font-bold tracking-[-0.01em]" />
          <span className="text-caption text-ink-muted">entradas menos saída total</span>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-divider pt-3.5">
          {metricas.map(m => (
            <div key={m.rotulo} className="flex min-w-0 flex-col">
              <dt className="text-[13px] text-ink-muted">{m.rotulo}</dt>
              <dd><Dinheiro centavos={m.valor} className="text-lg font-semibold" /></dd>
            </div>
          ))}
        </dl>
        <Link href="/economia" className="flex items-center justify-between gap-3 rounded-[12px] bg-surface-muted px-3.5 py-3 hover:bg-surface-sunken">
          <span className="flex flex-col">
            <span className="text-[13px] text-ink-muted">Guardado no mês</span>
            <Dinheiro centavos={totais.guardado} modo="sinal" semCor className="font-bold" />
          </span>
          <span className="flex items-center gap-1 text-[13px] font-semibold">
            Economia <ChevronRight size={16} strokeWidth={1.7} aria-hidden />
          </span>
        </Link>
      </div>

      {/* Web */}
      <dl className="hidden flex-wrap items-center gap-y-4 px-6 py-5 lg:flex">
        <div className="flex flex-[1_1_200px] flex-col">
          <dt className="text-[13px] text-ink-muted">Performance do mês</dt>
          <dd><Dinheiro centavos={totais.performance} modo="sinal" className="text-[28px] leading-tight font-bold" /></dd>
        </div>
        {metricas.map(m => (
          <div key={m.rotulo} className="flex flex-[1_1_140px] flex-col border-l border-divider pl-4">
            <dt className="text-[13px] text-ink-muted">{m.rotulo}</dt>
            <dd><Dinheiro centavos={m.valor} className="text-[17px] font-bold" /></dd>
          </div>
        ))}
        <div className="flex flex-[1_1_160px] flex-col border-l border-divider pl-4">
          <dt className="text-[13px] text-ink-muted">Guardado no mês</dt>
          <dd>
            <Link href="/economia" className="text-[17px] font-bold hover:underline">
              <Dinheiro centavos={totais.guardado} modo="sinal" semCor /> ›
            </Link>
          </dd>
        </div>
      </dl>
    </section>
  )
}
