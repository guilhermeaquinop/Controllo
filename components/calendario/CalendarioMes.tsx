'use client'
// Grade do mês: cabeçalho dos dias da semana, casas vazias antes do dia 1 e uma CelulaDia por dia.
import type { DiaCalculado } from '@/lib/calculo/saldo'
import type { Limites } from '@/lib/calculo/faixa'
import { casasAntes, diaPorExtenso } from '@/lib/calculo/calendario'
import { formatarReais } from '@/lib/formato'
import { useValoresOcultos } from '@/components/dinheiro/Dinheiro'
import { CelulaDia } from './CelulaDia'

const SEMANA_CURTA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

type Props = {
  mes: string
  dias: DiaCalculado[]
  hoje: string
  limites: Limites
  /** Dia em destaque na web (o do painel ao lado). */
  selecionado?: string
  onSelecionar: (dia: string) => void
}

export function CalendarioMes({ mes, dias, hoje, limites, selecionado, onSelecionar }: Props) {
  const { ocultos } = useValoresOcultos()
  const rotulo = (d: DiaCalculado) => {
    const saldo = d.saldo === null ? 'sem saldo' : ocultos ? 'saldo oculto' : `saldo ${formatarReais(d.saldo)}`
    const previsto = d.data > hoje ? ', previsto' : ''
    return `${diaPorExtenso(d.data)}${d.data === hoje ? ', hoje' : ''}, ${saldo}${previsto}`
  }

  return (
    <div className="flex flex-col gap-2.5 lg:gap-2">
      <div aria-hidden className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted lg:gap-1.5 lg:px-1 lg:text-left lg:text-caption lg:font-semibold">
        {SEMANA.map((nome, i) => (
          <span key={i}>
            <span className="lg:hidden">{SEMANA_CURTA[i]}</span>
            <span className="hidden lg:inline">{nome}</span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
        {Array.from({ length: casasAntes(mes) }, (_, i) => <span key={`vazia-${i}`} aria-hidden />)}
        {dias.map(d => (
          <CelulaDia
            key={d.data}
            dia={{ ...d, numero: Number(d.data.slice(8)), hoje: d.data === hoje, previsto: d.data > hoje }}
            limites={limites}
            selecionado={d.data === selecionado}
            rotulo={rotulo(d)}
            onSelecionar={onSelecionar}
          />
        ))}
      </div>
    </div>
  )
}
