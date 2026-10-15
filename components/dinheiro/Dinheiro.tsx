'use client'
// Valor em reais que respeita o "Ocultar valores" (o olho do topo).
// Envolva o app em <OcultarValoresProvider> (app/(app)/layout.tsx).
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatarComSinal, formatarReais } from '@/lib/formato'

const CHAVE = 'controllo:valores-ocultos'
const Ctx = createContext<{ ocultos: boolean; alternar: () => void }>({ ocultos: false, alternar: () => {} })

// A escolha mora no localStorage (fica no aparelho). useSyncExternalStore lê dali e
// re-renderiza quando muda nesta aba (avisar) ou em outra (evento "storage").
const ouvintes = new Set<() => void>()
let naMemoria = false // se o navegador bloquear o localStorage, vale só nesta aba

function assinar(aviso: () => void) {
  ouvintes.add(aviso)
  const deOutraAba = (e: StorageEvent) => { if (e.key === CHAVE) aviso() }
  window.addEventListener('storage', deOutraAba)
  return () => {
    ouvintes.delete(aviso)
    window.removeEventListener('storage', deOutraAba)
  }
}

function lerOcultos() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo !== null) return salvo === '1'
  } catch {}
  return naMemoria
}

export function OcultarValoresProvider({ children }: { children: ReactNode }) {
  // No servidor, os valores aparecem; o navegador aplica a escolha salva ao hidratar.
  const ocultos = useSyncExternalStore(assinar, lerOcultos, () => false)
  const alternar = () => {
    naMemoria = !ocultos
    try { localStorage.setItem(CHAVE, naMemoria ? '1' : '0') } catch {}
    ouvintes.forEach(avisar => avisar())
  }
  return <Ctx.Provider value={{ ocultos, alternar }}>{children}</Ctx.Provider>
}

export const useValoresOcultos = () => useContext(Ctx)

type Props = {
  centavos: number
  /** "sinal": "+ R$ 10,00" / "− R$ 10,00", colorido verde/vermelho */
  modo?: 'simples' | 'sinal'
  className?: string
}

export function Dinheiro({ centavos, modo = 'simples', className }: Props) {
  const { ocultos } = useValoresOcultos()
  const cor = modo === 'sinal' ? (centavos < 0 ? 'text-money-out' : 'text-money-in') : ''
  if (ocultos) return <span className={cn(cor, className)} aria-label="valor oculto">R$ •••••</span>
  return <span className={cn(cor, 'whitespace-nowrap', className)}>{modo === 'sinal' ? formatarComSinal(centavos) : formatarReais(centavos)}</span>
}

/** O botão de olho da barra superior. */
export function BotaoOcultarValores() {
  const { ocultos, alternar } = useValoresOcultos()
  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={ocultos}
      aria-label="Ocultar valores"
      className="grid size-control place-items-center rounded-md text-ink hover:bg-surface-sunken"
    >
      {ocultos ? <EyeOff size={22} strokeWidth={1.7} /> : <Eye size={22} strokeWidth={1.7} />}
    </button>
  )
}
