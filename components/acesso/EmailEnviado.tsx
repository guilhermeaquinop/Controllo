import type { ReactNode } from 'react'
import { MailCheck } from 'lucide-react'

/** Aviso que substitui o formulário depois de enviar um e-mail (cadastro ou nova senha). */
export function EmailEnviado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div role="status" className="flex flex-col gap-3 rounded-lg border border-border p-5">
      <span className="grid size-10 place-items-center rounded-full bg-surface-sunken" aria-hidden>
        <MailCheck size={20} strokeWidth={1.7} />
      </span>
      <h2 className="text-section">{titulo}</h2>
      <p className="text-ink-muted">{children}</p>
    </div>
  )
}
