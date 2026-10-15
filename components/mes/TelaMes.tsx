'use client'
// Tela do Mês. O servidor manda os dias já calculados; aqui fica só a interação:
// qual dia está aberto (na URL, ?dia=...), a folha do celular e o painel da web.
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import type { DiaCalculado, TotaisDoMes } from '@/lib/calculo/saldo'
import type { Limites } from '@/lib/calculo/faixa'
import { diaPorExtenso, diaValido, mesDe, nomeDoMes, nomeDoMesCurto, somarMeses } from '@/lib/calculo/calendario'
import type { Categoria } from '@/lib/configuracao/esquemas'
import { ultimasCategorias, type Lancamento } from '@/lib/lancamentos/tipos'
import { formatarData } from '@/lib/datas'
import { BotaoOcultarValores, Dinheiro } from '@/components/dinheiro/Dinheiro'
import { CalendarioMes } from '@/components/calendario/CalendarioMes'
import { LegendaFaixas } from '@/components/calendario/LegendaFaixas'
import { PainelDia, rotuloSemana } from '@/components/lancamento/PainelDia'
import { Folha, useTelaGrandeNoNavegador } from '@/components/layout/Folha'
import { DadosGerais } from './DadosGerais'

type Props = {
  mes: string // 'YYYY-MM'
  hoje: string
  dias: DiaCalculado[]
  lancamentos: Lancamento[]
  totais: TotaisDoMes
  saldoAntes: number
  saldoInicial: number
  saldoInicialData: string
  limites: Limites
  categorias: Categoria[]
}

const CLASSE_ICONE = 'grid size-control shrink-0 place-items-center rounded-md text-ink hover:bg-surface-sunken'

export function TelaMes(props: Props) {
  const { mes, hoje, dias, lancamentos, totais, limites, categorias } = props
  const web = useTelaGrandeNoNavegador() // null até o navegador dizer o tamanho da tela
  const params = useSearchParams()

  // Dia aberto vem da URL; só vale se for deste mês.
  const daUrl = diaValido(params.get('dia'))
  const aberto = daUrl && mesDe(daUrl) === mes ? daUrl : null
  // Na web sempre há um dia no painel: o aberto, hoje (se for este mês) ou o dia 1.
  const selecionado = aberto ?? (mesDe(hoje) === mes ? hoje : dias[0].data)

  // Trocar de dia não busca nada no servidor: só muda a URL (o Next sincroniza o useSearchParams).
  const abrirDia = (dia: string) => window.history.replaceState(null, '', `?m=${mes}&dia=${dia}`)
  const fecharDia = () => window.history.replaceState(null, '', `?m=${mes}`)

  const diaSelecionado = dias.find(d => d.data === selecionado)!
  const sugestoes = ultimasCategorias(lancamentos)
  const doDia = (dia: string) => lancamentos.filter(l => l.data === dia)
  const anterior = somarMeses(mes, -1)
  const proximo = somarMeses(mes, 1)

  const navegacao = (tamanho: 'celular' | 'web') => ({
    anterior: (
      <Link href={`/mes?m=${anterior}`} aria-label={`Mês anterior: ${nomeDoMesCurto(anterior)}`} className={CLASSE_ICONE}>
        <ChevronLeft size={tamanho === 'web' ? 24 : 22} strokeWidth={1.7} />
      </Link>
    ),
    proximo: (
      <Link href={`/mes?m=${proximo}`} aria-label={`Próximo mês: ${nomeDoMesCurto(proximo)}`} className={CLASSE_ICONE}>
        <ChevronRight size={tamanho === 'web' ? 24 : 22} strokeWidth={1.7} />
      </Link>
    ),
  })

  const comeco = <ComecoDoMes {...props} />

  return (
    <>
      {/* Barra superior do celular */}
      <header className="sticky top-0 z-30 flex h-[calc(var(--spacing-topbar)+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-border bg-surface pt-[env(safe-area-inset-top)] pr-1 pl-4 lg:hidden">
        <span className="text-heading">Mês</span>
        <div className="flex items-center">
          <BotaoOcultarValores />
          <Link href="/ajustes" aria-label="Ajustes" className={CLASSE_ICONE}>
            <Settings size={22} strokeWidth={1.7} />
          </Link>
        </div>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-4 pb-6 lg:gap-5 lg:px-[clamp(16px,2.5vw,36px)] lg:pt-7 lg:pb-10">
        {/* Cabeçalho da web */}
        <div className="hidden flex-wrap items-center justify-between gap-3 lg:flex">
          <div className="flex items-center gap-1">
            {navegacao('web').anterior}
            <h1 className="min-w-[220px] text-center text-title first-letter:uppercase">{nomeDoMes(mes)}</h1>
            {navegacao('web').proximo}
            <span className="ml-2 text-[13px] text-ink-muted">{comeco}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LegendaFaixas limites={limites} />
            <BotaoOcultarValores />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:gap-5">
          <section aria-label="Calendário do mês" className="flex min-w-0 flex-col gap-2.5 rounded-lg border border-border bg-surface px-3 pt-3 pb-4 lg:flex-[999_1_560px] lg:p-4">
            {/* Cabeçalho do calendário no celular */}
            <div className="grid grid-cols-[44px_1fr_44px] items-center lg:hidden">
              {navegacao('celular').anterior}
              <div className="flex flex-col text-center">
                <h1 className="text-heading">{nomeDoMes(mes)}</h1>
                <span className="text-caption text-ink-muted">{comeco}</span>
              </div>
              {navegacao('celular').proximo}
            </div>
            {/* O destaque do dia selecionado só aparece a partir de lg (ver CelulaDia). */}
            <CalendarioMes mes={mes} dias={dias} hoje={hoje} limites={limites} selecionado={selecionado} onSelecionar={abrirDia} />
            <LegendaFaixas limites={limites} className="pt-1 lg:hidden" />
          </section>

          {/* Painel do dia (web). Escondido por CSS no celular, para não "pular" ao carregar. */}
          {web !== false && (
            <section aria-label="Dia selecionado" className="hidden min-w-0 flex-col rounded-lg border border-border bg-surface p-5 lg:flex lg:flex-[1_1_340px]">
              <PainelDia dia={diaSelecionado} hoje={hoje} lancamentos={doDia(selecionado)} categorias={categorias} sugestoes={sugestoes} limites={limites} modo="painel" />
            </section>
          )}
        </div>

        <DadosGerais totais={totais} />
      </main>

      {/* Folha do dia (celular): só depois de confirmar que a tela é pequena. */}
      {web === false && (
        <Folha
          aberta={aberto !== null}
          onFechar={fecharDia}
          titulo={diaPorExtenso(selecionado)}
          sobretitulo={rotuloSemana(selecionado, hoje)}
        >
          <PainelDia dia={diaSelecionado} hoje={hoje} lancamentos={doDia(selecionado)} categorias={categorias} sugestoes={sugestoes} limites={limites} modo="folha" />
        </Folha>
      )}
    </>
  )
}

/** "começa com R$ 635,08", ou onde fica o saldo inicial quando o mês começa antes dele. */
function ComecoDoMes({ mes, saldoAntes, saldoInicial, saldoInicialData }: Props) {
  const primeiro = `${mes}-01`
  if (primeiro >= saldoInicialData) return <>começa com <Dinheiro centavos={saldoAntes} /></>
  if (mesDe(saldoInicialData) === mes) {
    return <>saldo inicial de <Dinheiro centavos={saldoInicial} /> em {formatarData(saldoInicialData).slice(0, 5)}</>
  }
  return <>antes do saldo inicial</>
}
