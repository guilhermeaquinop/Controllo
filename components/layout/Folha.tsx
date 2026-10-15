'use client'
// Folha que sobe de baixo no celular (Drawer, vaul) e vira um diálogo centralizado na web (lg).
import { useSyncExternalStore, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'

const TELA_GRANDE = '(min-width: 1024px)' // lg do Tailwind

function assinarTela(aviso: () => void) {
  const consulta = window.matchMedia(TELA_GRANDE)
  consulta.addEventListener('change', aviso)
  return () => consulta.removeEventListener('change', aviso)
}

export function useTelaGrande() {
  return useSyncExternalStore(assinarTela, () => window.matchMedia(TELA_GRANDE).matches, () => false)
}

/** Como useTelaGrande, mas null no servidor e na hidratação: para só montar algo quando o tamanho for conhecido. */
export function useTelaGrandeNoNavegador(): boolean | null {
  return useSyncExternalStore(assinarTela, () => window.matchMedia(TELA_GRANDE).matches, () => null)
}

type Props = {
  aberta: boolean
  onFechar: () => void
  titulo: string
  /** Linha pequena acima do título (ex.: "Domingo" na folha do dia). */
  sobretitulo?: string
  descricao?: string
  children: ReactNode
}

const CLASSE_FECHAR = 'grid size-control shrink-0 place-items-center rounded-md text-ink hover:bg-surface-sunken'

export function Folha({ aberta, onFechar, titulo, sobretitulo, descricao, children }: Props) {
  const web = useTelaGrande()
  const aoMudar = (aberto: boolean) => { if (!aberto) onFechar() }

  if (web) {
    return (
      <Dialog open={aberta} onOpenChange={aoMudar}>
        <DialogContent showCloseButton={false} className="gap-5 rounded-lg bg-surface p-6 ring-0 sm:max-w-[440px]">
          <div className="flex flex-col gap-1 pr-10">
            {sobretitulo && <span className="text-label text-ink-muted">{sobretitulo}</span>}
            <DialogTitle className="text-heading">{titulo}</DialogTitle>
            {descricao && <DialogDescription className="text-ink-muted">{descricao}</DialogDescription>}
          </div>
          {children}
          {/* Depois do conteúdo no código: o foco inicial vai para o primeiro campo, não para o X. */}
          <DialogClose className={`${CLASSE_FECHAR} absolute top-3 right-3`} aria-label="Fechar">
            <X size={22} strokeWidth={1.7} />
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={aberta} onOpenChange={aoMudar}>
      <DrawerContent className="rounded-t-sheet border-0 bg-surface data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
        <div className="flex items-start justify-between gap-3 pt-2 pr-2 pl-4">
          <div className="flex min-w-0 flex-col pt-2.5">
            {sobretitulo && <span className="text-label text-ink-muted">{sobretitulo}</span>}
            <DrawerTitle className="text-[22px] leading-tight font-bold">{titulo}</DrawerTitle>
            {descricao && <DrawerDescription className="text-ink-muted">{descricao}</DrawerDescription>}
          </div>
          <DrawerClose className={CLASSE_FECHAR} aria-label="Fechar">
            <X size={22} strokeWidth={1.7} />
          </DrawerClose>
        </div>
        <div className="overflow-y-auto px-4 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))]">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
