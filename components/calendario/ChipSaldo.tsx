'use client'
import { cn } from '@/lib/utils'
import { CLASSE_FAIXA, faixaDoSaldo, type Limites } from '@/lib/calculo/faixa'
import { formatarCurto, formatarNumero } from '@/lib/formato'
import { useValoresOcultos } from '@/components/dinheiro/Dinheiro'

type Props = {
  /** null = dia antes do saldo inicial */
  centavos: number | null
  limites: Limites
  /** dia depois de hoje: ganha o anel branco */
  previsto?: boolean
  /** "curto" no celular (3.627), "completo" na web (3.627,09) */
  formato?: 'curto' | 'completo'
  className?: string
}

export function ChipSaldo({ centavos, limites, previsto, formato = 'curto', className }: Props) {
  const { ocultos } = useValoresOcultos()
  const base = formato === 'curto'
    ? 'rounded-sm px-0.5 py-1 text-chip text-center'
    : 'rounded-sm px-1.5 py-0.5 text-caption font-bold text-right'

  if (centavos === null) {
    return <span className={cn(base, 'bg-surface-sunken text-ink-muted', className)}>—</span>
  }
  return (
    <span
      className={cn(
        base,
        'block overflow-hidden whitespace-nowrap',
        CLASSE_FAIXA[faixaDoSaldo(centavos, limites)],
        previsto && 'shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.85)]',
        className,
      )}
    >
      {ocultos ? '•••' : formato === 'curto' ? formatarCurto(centavos) : formatarNumero(centavos)}
    </span>
  )
}
