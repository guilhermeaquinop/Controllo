// Barra superior do celular (some a partir de lg). Na web, o título vem em <CabecalhoPagina>.
import Link from 'next/link'
import { ChevronLeft, Settings } from 'lucide-react'
import { BotaoOcultarValores } from '@/components/dinheiro/Dinheiro'

const CLASSE_BARRA =
  'sticky top-0 z-30 h-[calc(var(--spacing-topbar)+env(safe-area-inset-top))] shrink-0 border-b border-border bg-surface pt-[env(safe-area-inset-top)] lg:hidden'
const CLASSE_ICONE = 'grid size-control place-items-center rounded-md text-ink hover:bg-surface-sunken'

type Props = {
  titulo: string
  /** Tela interna (Ajustes): seta de voltar à esquerda e título no centro. */
  voltarPara?: string
}

export function BarraSuperior({ titulo, voltarPara }: Props) {
  if (voltarPara) {
    return (
      <header className={`${CLASSE_BARRA} grid grid-cols-[44px_1fr_44px] items-center px-1`}>
        <Link href={voltarPara} aria-label="Voltar" className={CLASSE_ICONE}>
          <ChevronLeft size={22} strokeWidth={1.7} />
        </Link>
        <h1 className="text-center text-heading">{titulo}</h1>
        <span />
      </header>
    )
  }
  return (
    <header className={`${CLASSE_BARRA} flex items-center justify-between pr-1 pl-4`}>
      <h1 className="text-heading">{titulo}</h1>
      <div className="flex items-center">
        <BotaoOcultarValores />
        <Link href="/ajustes" aria-label="Ajustes" className={CLASSE_ICONE}>
          <Settings size={22} strokeWidth={1.7} />
        </Link>
      </div>
    </header>
  )
}

/** Cabeçalho da tela na web (a partir de lg): título e o olho. Cada tela pode pôr mais coisas no meio. */
export function CabecalhoPagina({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <h1 className="text-title">{titulo}</h1>
      <div className="flex flex-1 items-center justify-end gap-4">
        {children}
        <BotaoOcultarValores />
      </div>
    </div>
  )
}

/** Área de conteúdo das telas logadas: px-4 no celular, px-9 na web. */
export function Conteudo({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <main className={`flex flex-col gap-4 px-4 pt-4 pb-6 lg:gap-5 lg:px-9 lg:py-7 ${className}`}>{children}</main>
}
