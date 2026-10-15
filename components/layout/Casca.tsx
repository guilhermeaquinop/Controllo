'use client'
// Casca das telas logadas: menu lateral (web), barra de abas (celular) e o "Ocultar valores".
import { useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { OcultarValoresProvider } from '@/components/dinheiro/Dinheiro'
import { BarraAbas, MenuLateral } from './Navegacao'
import { sair } from '@/lib/acesso/acoes'

export function Casca({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [, iniciar] = useTransition()
  // Etapa 3: o Lançar abre a folha do dia (celular) ou o painel do dia (web) em hoje.
  const lancar = () => router.push('/mes')

  return (
    <OcultarValoresProvider>
      <div className="flex min-h-dvh">
        <MenuLateral onLancar={lancar} onSair={() => iniciar(() => sair())} />
        <div className="flex min-w-0 flex-1 flex-col pb-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
      </div>
      <BarraAbas onLancar={lancar} />
    </OcultarValoresProvider>
  )
}
