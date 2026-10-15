'use client'
// Conteúdo do dia: resumo (Entrou / Saiu / Diário / Saldo), formulário e a lista do dia.
// No celular vai dentro da folha que sobe; na web, no painel à direita do calendário.
import { useState } from 'react'
import type { DiaCalculado, TipoLancamento } from '@/lib/calculo/saldo'
import { CLASSE_FAIXA, faixaDoSaldo, type Limites } from '@/lib/calculo/faixa'
import { diaDaSemana, diaPorExtenso } from '@/lib/calculo/calendario'
import type { Categoria } from '@/lib/configuracao/esquemas'
import { NOME_TIPO } from '@/lib/lancamentos/esquemas'
import { tituloDoLancamento, type Lancamento } from '@/lib/lancamentos/tipos'
import { formatarReais } from '@/lib/formato'
import { cn } from '@/lib/utils'
import { useValoresOcultos, ValorNumero } from '@/components/dinheiro/Dinheiro'
import { ChipSaldo } from '@/components/calendario/ChipSaldo'
import { FormLancamento } from './FormLancamento'
import { ItemLancamento } from './ItemLancamento'

type Props = {
  dia: DiaCalculado
  hoje: string
  lancamentos: Lancamento[]
  categorias: Categoria[]
  sugestoes?: Partial<Record<TipoLancamento, string>>
  limites: Limites
  /** "folha": celular (o cabeçalho fica na Folha). "painel": web, com cabeçalho próprio. */
  modo: 'folha' | 'painel'
}

export function rotuloSemana(dia: string, hoje: string) {
  return `${diaDaSemana(dia)}${dia === hoje ? ' · hoje' : dia > hoje ? ' · previsto' : ''}`
}

export function PainelDia({ dia, hoje, lancamentos, categorias, sugestoes, limites, modo }: Props) {
  const [editando, setEditando] = useState<Lancamento | null>(null)
  // Ao trocar de dia, sai da edição (o lançamento era de outro dia). Ajuste durante a renderização,
  // como recomenda o React, em vez de um useEffect.
  const [diaAnterior, setDiaAnterior] = useState(dia.data)
  if (diaAnterior !== dia.data) {
    setDiaAnterior(dia.data)
    setEditando(null)
  }
  const web = modo === 'painel'

  return (
    <div className={cn('flex flex-col', web ? 'gap-4' : 'gap-[18px]')}>
      {web && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-label text-ink-muted">{rotuloSemana(dia.data, hoje)}</span>
            <h2 className="text-[22px] leading-tight font-bold">{diaPorExtenso(dia.data)}</h2>
          </div>
          <SaldoGrande centavos={dia.saldo} limites={limites} previsto={dia.data > hoje} />
        </div>
      )}

      <dl className={cn('grid gap-2 rounded-[14px] bg-surface-muted p-3', web ? 'grid-cols-3 rounded-[12px]' : 'grid-cols-4')}>
        <Resumo rotulo="Entrou" centavos={dia.entradas} cor="text-money-in" />
        <Resumo rotulo="Saiu" centavos={dia.saidas} cor="text-money-out" />
        <Resumo rotulo="Diário" centavos={dia.diario} cor="text-money-out" />
        {!web && (
          <div className="flex min-w-0 flex-col items-start">
            <dt className="text-[11px] text-ink-muted">Saldo</dt>
            <dd className="max-w-full">
              <ChipSaldo centavos={dia.saldo} limites={limites} previsto={dia.data > hoje} formato="completo" className="text-left" />
            </dd>
          </div>
        )}
      </dl>

      {editando ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-section">Editar lançamento</h3>
          <FormLancamento
            key={editando.id}
            dia={dia.data}
            categorias={categorias}
            lancamento={editando}
            onConcluir={() => setEditando(null)}
            onCancelar={() => setEditando(null)}
          />
        </div>
      ) : (
        <FormLancamento dia={dia.data} categorias={categorias} sugestoes={sugestoes} />
      )}

      <section aria-label="Lançamentos do dia" className="flex flex-col border-t border-border pt-1.5">
        <div className="flex items-baseline justify-between gap-2 pt-3 pb-0.5">
          <h3 className={cn('font-semibold', web ? 'text-[15px]' : 'text-section')}>Entradas e saídas do dia</h3>
          {lancamentos.length > 0 && (
            <span className="text-caption text-ink-muted">{lancamentos.length === 1 ? '1 item' : `${lancamentos.length} itens`}</span>
          )}
        </div>
        {lancamentos.length === 0 ? (
          <p className="py-2 text-ink-muted">Nada lançado neste dia.</p>
        ) : (
          <ul className="flex flex-col">
            {lancamentos.map(l => (
              <li key={l.id} className="border-b border-divider last:border-b-0 [&>button]:border-b-0">
                <ItemLancamento
                  tipo={l.tipo}
                  titulo={tituloDoLancamento(l)}
                  categoria={l.categoria ?? l.reserva ?? NOME_TIPO[l.tipo]}
                  centavos={l.valor}
                  onAbrir={() => setEditando(l)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Resumo({ rotulo, centavos, cor }: { rotulo: string; centavos: number; cor: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-[11px] text-ink-muted lg:text-caption">{rotulo}</dt>
      <dd className={cn('truncate text-[13px] font-bold lg:text-body', centavos > 0 ? cor : 'text-ink-muted')}>
        <ValorNumero centavos={centavos} />
      </dd>
    </div>
  )
}

/** Saldo do dia no canto do painel da web: "R$ 3.627,09" na cor da faixa. */
function SaldoGrande({ centavos, limites, previsto }: { centavos: number | null; limites: Limites; previsto: boolean }) {
  const { ocultos } = useValoresOcultos()
  if (centavos === null) return <span className="rounded-sm bg-surface-sunken px-2.5 py-1 font-bold text-ink-muted">—</span>
  return (
    <span
      className={cn(
        'shrink-0 rounded-sm px-2.5 py-1 font-bold whitespace-nowrap',
        CLASSE_FAIXA[faixaDoSaldo(centavos, limites)],
        previsto && 'shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.85)]',
      )}
    >
      {ocultos ? 'R$ •••••' : formatarReais(centavos)}
    </span>
  )
}
