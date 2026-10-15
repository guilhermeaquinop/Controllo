// Legenda das faixas de cor: "negativo, até 1.000, até 2.000, até 4.000, acima", com os limites da pessoa.
import type { Limites } from '@/lib/calculo/faixa'
import { formatarLimite } from '@/lib/formato'
import { cn } from '@/lib/utils'

export function LegendaFaixas({ limites, className }: { limites: Limites; className?: string }) {
  const itens = [
    { cor: 'bg-zone-negative', texto: 'negativo' },
    { cor: 'bg-zone-low', texto: `até ${formatarLimite(limites.faixa1)}` },
    { cor: 'bg-zone-mid', texto: `até ${formatarLimite(limites.faixa2)}` },
    { cor: 'bg-zone-ok', texto: `até ${formatarLimite(limites.faixa3)}` },
    { cor: 'bg-zone-high', texto: 'acima' },
  ]
  return (
    <ul aria-label="Faixas de cor do saldo" className={cn('flex flex-wrap gap-x-3 gap-y-1.5 text-caption text-ink-muted', className)}>
      {itens.map(i => (
        <li key={i.cor} className="inline-flex items-center gap-1.5">
          <span className={cn('size-3 rounded-[4px]', i.cor)} aria-hidden />
          {i.texto}
        </li>
      ))}
    </ul>
  )
}
