'use client'
import { cn } from '@/lib/utils'
import type { TipoLancamento } from './ItemLancamento'

const OPCOES: { valor: TipoLancamento; rotulo: string }[] = [
  { valor: 'entrada', rotulo: 'Entrada' },
  { valor: 'saida', rotulo: 'Saída' },
  { valor: 'diario', rotulo: 'Diário' },
]

/** Segmentado Entrada / Saída / Diário. Diário vem selecionado por padrão no formulário. */
export function SeletorTipo({ valor, onChange }: { valor: TipoLancamento; onChange: (t: TipoLancamento) => void }) {
  return (
    <div role="radiogroup" aria-label="Tipo de lançamento" className="flex gap-1 rounded-full bg-surface-sunken p-1">
      {OPCOES.map(o => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          onClick={() => onChange(o.valor)}
          className={cn(
            'h-control flex-1 rounded-full font-medium text-ink-muted',
            valor === o.valor && 'bg-primary font-semibold text-on-primary',
          )}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  )
}
