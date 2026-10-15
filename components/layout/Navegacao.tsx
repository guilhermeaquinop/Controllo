'use client'
// Barra de abas (celular) e menu lateral (web). Mesmos destinos, layouts diferentes.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, ChartNoAxesColumn, Grid3x3, LogOut, Plus, Settings, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/marca/Logo'

const ITENS = [
  { href: '/mes', rotulo: 'Mês', Icone: CalendarDays },
  { href: '/ano', rotulo: 'Ano', Icone: Grid3x3 },
  { href: '/economia', rotulo: 'Economia', Icone: Wallet },
  { href: '/resumo', rotulo: 'Resumo', Icone: ChartNoAxesColumn },
] as const

/** Celular: 5 posições, Lançar no centro. Escondida a partir de lg. */
export function BarraAbas({ onLancar }: { onLancar: () => void }) {
  const atual = usePathname()
  const aba = (i: (typeof ITENS)[number]) => {
    const ativa = atual.startsWith(i.href)
    return (
      <Link
        key={i.href}
        href={i.href}
        aria-current={ativa ? 'page' : undefined}
        className={cn('flex flex-col items-center justify-center gap-0.5 text-caption', ativa ? 'font-semibold text-ink' : 'font-medium text-ink-muted')}
      >
        <span className={cn('grid h-7 w-14 place-items-center rounded-full', ativa && 'bg-surface-sunken')}>
          <i.Icone size={22} strokeWidth={1.7} />
        </span>
        {i.rotulo}
      </Link>
    )
  }
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom))] grid-cols-5 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {aba(ITENS[0])}
      {aba(ITENS[1])}
      <button type="button" onClick={onLancar} className="flex flex-col items-center justify-center gap-0.5 text-caption font-semibold text-ink">
        <span className="-mt-[22px] grid size-[52px] place-items-center rounded-full bg-primary text-on-primary ring-[5px] ring-surface">
          <Plus size={24} strokeWidth={2.2} />
        </span>
        Lançar
      </button>
      {aba(ITENS[2])}
      {aba(ITENS[3])}
    </nav>
  )
}

/** Web: menu lateral de 220px. Escondido abaixo de lg. */
export function MenuLateral({ onLancar, onSair }: { onLancar: () => void; onSair: () => void }) {
  const atual = usePathname()
  const item = 'flex h-control items-center gap-3 rounded-md px-3 font-medium text-ink-muted hover:bg-surface-muted hover:text-ink'
  return (
    <aside aria-label="Menu" className="sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-6 lg:flex">
      <Logo className="mx-2 h-[27px] w-auto self-start text-primary" />
      <button type="button" onClick={onLancar} className="flex h-control items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary">
        <Plus size={18} strokeWidth={2.2} /> Lançar
      </button>
      <nav aria-label="Navegação principal" className="flex flex-col gap-1">
        {ITENS.map(i => {
          const ativa = atual.startsWith(i.href)
          return (
            <Link key={i.href} href={i.href} aria-current={ativa ? 'page' : undefined} className={cn(item, ativa && 'bg-surface-sunken font-semibold text-ink')}>
              <i.Icone size={20} strokeWidth={1.7} /> {i.rotulo}
            </Link>
          )
        })}
      </nav>
      <nav aria-label="Conta" className="mt-auto flex flex-col gap-1 border-t border-divider pt-4">
        <Link href="/ajustes" className={cn(item, atual.startsWith('/ajustes') && 'bg-surface-sunken font-semibold text-ink')}>
          <Settings size={20} strokeWidth={1.7} /> Ajustes
        </Link>
        <button type="button" onClick={onSair} className={item}>
          <LogOut size={20} strokeWidth={1.7} /> Sair
        </button>
      </nav>
    </aside>
  )
}
