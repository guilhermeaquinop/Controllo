import { Logo } from '@/components/marca/Logo'
import { PainelApresentacao } from '@/components/acesso/Moldura'

// Telas de acesso. Celular: uma coluna branca. Web (lg): painel escuro à esquerda, formulário à direita.
export default function LayoutAcesso({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface">
      <PainelApresentacao />
      <main className="flex min-w-0 flex-1 flex-col px-6 pt-[calc(56px+env(safe-area-inset-top))] pb-[calc(32px+env(safe-area-inset-bottom))] lg:flex-[1_1_480px] lg:items-center lg:justify-center lg:py-12">
        <div className="flex w-full flex-1 flex-col gap-8 lg:max-w-[380px] lg:flex-none lg:gap-[18px]">
          <Logo className="h-[34px] w-auto self-start text-primary lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  )
}
