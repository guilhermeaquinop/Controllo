// Cartão provisório das telas que ainda não foram construídas. Sai quando a etapa chegar.
export function EmBreve({ etapa, children }: { etapa: number; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-5">
      <span className="text-label text-ink-muted">Etapa {etapa}</span>
      <p>{children}</p>
    </section>
  )
}
