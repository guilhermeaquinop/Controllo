// Peças fixas das telas de acesso: cabeçalho, rodapé e o painel escuro da web.
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CLASSE_FAIXA, faixaDoSaldo } from '@/lib/calculo/faixa'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/marca/Logo'

type PropsCabecalho = {
  titulo: string
  descricao: string
  /** Texto diferente no celular, onde não existe o painel escuro (o Entrar usa o slogan). */
  tituloCelular?: string
  descricaoCelular?: string
}

export function CabecalhoAcesso({ titulo, descricao, tituloCelular, descricaoCelular }: PropsCabecalho) {
  const responsivo = (celular: string | undefined, web: string) =>
    celular ? (
      <>
        <span className="lg:hidden">{celular}</span>
        <span className="hidden lg:inline">{web}</span>
      </>
    ) : (
      web
    )
  return (
    <header className="flex flex-col gap-2 lg:gap-1.5">
      <h1 className="text-[28px] leading-tight font-bold tracking-[-0.01em] lg:text-title lg:tracking-normal">
        {responsivo(tituloCelular, titulo)}
      </h1>
      <p className="text-ink-muted">{responsivo(descricaoCelular, descricao)}</p>
    </header>
  )
}

/** Rodapé: no celular vai para o fim da tela, com a faixa de cores; na web fica logo abaixo do formulário. */
export function RodapeAcesso({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-auto flex flex-col items-center gap-5 pt-8 lg:mt-2 lg:pt-0">
      <FaixaDeCores />
      <p className="text-center text-ink-muted">{children}</p>
    </footer>
  )
}

export function LinkAcesso({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn('font-semibold text-ink underline underline-offset-2 hover:text-ink-muted', className)}>
      {children}
    </Link>
  )
}

const CORES_RODAPE = ['bg-zone-high', 'bg-zone-ok', 'bg-zone-ok', 'bg-zone-mid', 'bg-zone-low', 'bg-zone-mid', 'bg-zone-ok', 'bg-zone-high', 'bg-zone-high', 'bg-zone-ok']

function FaixaDeCores() {
  return (
    <div className="flex gap-1 lg:hidden" aria-hidden>
      {CORES_RODAPE.map((cor, i) => <span key={i} className={cn('size-3.5 rounded-[3px]', cor)} />)}
    </div>
  )
}

/** Painel escuro da esquerda no login da web: slogan e um "ano" de exemplo, um quadrado por dia. */
export function PainelApresentacao() {
  return (
    <section
      aria-label="Apresentação"
      className="hidden min-w-0 flex-[1_1_520px] flex-col justify-between gap-12 bg-primary px-[clamp(24px,5vw,72px)] py-12 text-on-primary [--logo-recorte:var(--primary)] lg:flex"
    >
      <Logo className="h-[34px] w-auto self-start text-on-primary" />
      <div className="flex flex-col gap-7">
        <p className="max-w-[14ch] text-[clamp(32px,3.4vw,48px)] leading-[1.12] font-bold tracking-[-0.02em]">
          Seu dinheiro, dia a dia.
        </p>
        <p className="max-w-[44ch] text-base text-on-primary/75">
          Lance o que entrou e saiu, veja o saldo de cada dia mudar de cor e acompanhe quanto está guardando.
        </p>
        <div
          role="img"
          aria-label="Exemplo de um ano visto dia a dia, cada quadrado colorido pela faixa do saldo"
          className="grid max-w-[520px] grid-cols-[repeat(26,minmax(0,1fr))] gap-1"
        >
          {MAPA_EXEMPLO.map((classe, i) => <span key={i} className={cn('aspect-square rounded-[3px]', classe)} />)}
        </div>
      </div>
      <span className="text-caption text-on-primary/60">Cada quadrado é um dia. A cor mostra a faixa do saldo.</span>
    </section>
  )
}

// Mesmo gerador do mockup (semente fixa): 182 dias, os últimos 13 ainda sem saldo.
const MAPA_EXEMPLO: string[] = (() => {
  let semente = 11
  const aleatorio = () => {
    semente = (semente * 16807) % 2147483647
    return (semente - 1) / 2147483646
  }
  const dias: string[] = []
  let reais = 2500
  for (let i = 0; i < 182; i++) {
    reais += (aleatorio() - 0.5) * 900
    if (i % 30 === 4) reais += 2200
    if (i % 30 === 10) reais -= 1900
    reais = Math.max(-300, Math.min(6000, reais))
    const fundo = CLASSE_FAIXA[faixaDoSaldo(Math.round(reais * 100))].split(' ')[0]
    dias.push(i > 168 ? 'bg-on-primary/15' : fundo)
  }
  return dias
})()
