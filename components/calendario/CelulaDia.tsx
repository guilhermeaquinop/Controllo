'use client'
import { cn } from '@/lib/utils'
import type { Limites } from '@/lib/calculo/faixa'
import { formatarNumero } from '@/lib/formato'
import { ChipSaldo } from './ChipSaldo'

export type Dia = {
  data: string            // 'YYYY-MM-DD'
  numero: number
  entradas: number        // centavos
  saidas: number
  diario: number
  saldo: number | null
  hoje: boolean
  previsto: boolean
}

type Props = {
  dia: Dia
  limites: Limites
  selecionado?: boolean
  onSelecionar: (data: string) => void
}

/** Célula do calendário. No celular mostra só o chip; a partir de lg mostra os movimentos do dia. */
export function CelulaDia({ dia, limites, selecionado, onSelecionar }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelecionar(dia.data)}
      aria-pressed={selecionado}
      aria-label={`Dia ${dia.numero}`}
      className={cn(
        'flex min-w-0 flex-col justify-between rounded-md text-left text-ink',
        'h-14 border border-transparent p-[5px_3px_4px] hover:border-border-control',
        'lg:h-auto lg:min-h-[104px] lg:gap-1 lg:border-border lg:bg-surface lg:p-2',
        selecionado && 'lg:border-2 lg:border-primary lg:p-[7px]',
      )}
    >
      <span
        className={cn(
          'ml-0.5 grid size-5 place-items-center rounded-full text-xs font-semibold lg:size-6 lg:text-[13px]',
          dia.hoje && 'bg-primary text-on-primary',
        )}
      >
        {dia.numero}
      </span>

      <span className="hidden min-w-0 flex-col text-[11px] font-semibold leading-[1.35] lg:flex">
        {dia.entradas > 0 && <span className="truncate text-money-in">+ {formatarNumero(dia.entradas)}</span>}
        {dia.saidas > 0 && <span className="truncate text-money-out">− {formatarNumero(dia.saidas)}</span>}
        {dia.diario > 0 && <span className="truncate font-medium text-ink-muted">diário {formatarNumero(dia.diario)}</span>}
      </span>

      <ChipSaldo centavos={dia.saldo} limites={limites} previsto={dia.previsto} formato="curto" className="lg:hidden" />
      <ChipSaldo centavos={dia.saldo} limites={limites} previsto={dia.previsto} formato="completo" className="hidden lg:block" />
    </button>
  )
}
