// Cartão padrão das telas: fundo branco, borda, cantos de 16px e 20px de respiro (DESIGN.md).
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  titulo?: string
  descricao?: string
  /** Fica à direita do título (ex.: botão "+ Nova"). */
  acao?: ReactNode
  className?: string
  children?: ReactNode
}

export function Cartao({ titulo, descricao, acao, className, children }: Props) {
  return (
    <section aria-label={titulo} className={cn('flex flex-col gap-4 rounded-lg border border-border bg-surface p-5', className)}>
      {(titulo || acao) && (
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {titulo && <h2 className="text-section">{titulo}</h2>}
            {descricao && <p className="text-caption text-ink-muted">{descricao}</p>}
          </div>
          {acao}
        </div>
      )}
      {children}
    </section>
  )
}
