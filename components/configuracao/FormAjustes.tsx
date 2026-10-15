'use client'
// Saldo inicial e faixas de cor, salvos juntos pelo botão "Salvar ajustes" (fim da tela, como no mockup).
// As categorias ficam entre os cartões e o botão, mas fora do <form>: cada uma salva sozinha.
import { useState, useTransition, type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { salvarAjustes } from '@/lib/configuracao/acoes'
import { esquemaAjustes, type DadosAjustes } from '@/lib/configuracao/esquemas'
import { formatarLimite, formatarNumero, lerValor } from '@/lib/formato'
import type { Limites } from '@/lib/calculo/faixa'
import { cn } from '@/lib/utils'
import { Cartao } from '@/components/layout/Cartao'
import { AvisoFormulario, AvisoSalvo, BotaoPrincipal, CampoData, CampoDinheiro, MensagemCampo } from '@/components/formulario/Campos'

const ID_FORM = 'form-ajustes'

type Props = {
  saldoInicial: number
  saldoInicialData: string
  limites: Limites
  hoje: string
  /** Conteúdo entre as faixas e o botão (o cartão de categorias). */
  entre?: ReactNode
}

export function FormAjustes({ saldoInicial, saldoInicialData, limites, hoje, entre }: Props) {
  const [pendente, iniciar] = useTransition()
  const [salvo, setSalvo] = useState(false)
  const valoresSalvos: DadosAjustes = {
    saldo: formatarNumero(saldoInicial),
    data: saldoInicialData,
    faixa1: formatarLimite(limites.faixa1),
    faixa2: formatarLimite(limites.faixa2),
    faixa3: formatarLimite(limites.faixa3),
  }
  const { register, handleSubmit, getValues, setError, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaAjustes),
    defaultValues: valoresSalvos,
  })

  const enviar = handleSubmit(() => {
    setSalvo(false)
    iniciar(async () => {
      const digitados = getValues()
      const r = await salvarAjustes(digitados)
      if (!r.ok) return setError('root.servidor', { message: r.erro })
      reset(digitados) // os valores salvos viram o novo ponto de partida
      setSalvo(true)
    })
  })

  // "4.000 ou mais" acompanha o que está sendo digitado no último limite.
  const faixa3 = lerValor(useWatch({ control, name: 'faixa3' }) ?? '')
  const rotuloAlta = `${faixa3 && faixa3 > 0 ? formatarLimite(faixa3) : formatarLimite(limites.faixa3)} ou mais`

  return (
    <>
      <form id={ID_FORM} onSubmit={enviar} noValidate onChange={() => setSalvo(false)} className="flex flex-col gap-4 lg:gap-5">
        <AvisoFormulario>{errors.root?.servidor?.message}</AvisoFormulario>

        <Cartao
          titulo="Saldo inicial"
          descricao="Quanto havia na conta no começo do dia escolhido. Daí em diante o saldo passa de um dia para o outro e de um mês para o outro."
        >
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3">
            <CampoDinheiro rotulo="Valor" erro={errors.saldo?.message} {...register('saldo')} />
            <Controller control={control} name="data" render={({ field }) => <CampoData rotulo="No dia" max={hoje} erro={errors.data?.message} {...field} />} />
          </div>
        </Cartao>

        <Cartao titulo="Faixas de cor do saldo" descricao="Como cada dia aparece no calendário do mês e do ano." className="gap-3.5">
          <div className="flex flex-col gap-2.5">
            <LinhaFaixa cor="bg-zone-negative" rotulo="Negativo">
              <span className="text-right text-caption text-ink-muted">abaixo de 0</span>
            </LinhaFaixa>
            <LinhaFaixa cor="bg-zone-low" rotulo="Abaixo de" nome="Baixa" erro={errors.faixa1?.message}>
              <CampoLimite {...register('faixa1')} aria-label="Faixa baixa: abaixo de" invalido={!!errors.faixa1} />
            </LinhaFaixa>
            <LinhaFaixa cor="bg-zone-mid" rotulo="Abaixo de" nome="Média" erro={errors.faixa2?.message}>
              <CampoLimite {...register('faixa2')} aria-label="Faixa média: abaixo de" invalido={!!errors.faixa2} />
            </LinhaFaixa>
            <LinhaFaixa cor="bg-zone-ok" rotulo="Abaixo de" nome="Boa" erro={errors.faixa3?.message}>
              <CampoLimite {...register('faixa3')} aria-label="Faixa boa: abaixo de" invalido={!!errors.faixa3} />
            </LinhaFaixa>
            <LinhaFaixa cor="bg-zone-high" rotulo={rotuloAlta} />
          </div>
        </Cartao>
      </form>

      {entre}

      <div className="flex flex-col gap-2">
        <BotaoPrincipal form={ID_FORM} pendente={pendente}>{pendente ? 'Salvando' : 'Salvar ajustes'}</BotaoPrincipal>
        <AvisoSalvo>{salvo ? 'Ajustes salvos.' : null}</AvisoSalvo>
      </div>
    </>
  )
}

function LinhaFaixa({ cor, rotulo, nome, erro, children }: {
  cor: string
  rotulo: string
  /** Nome da faixa para leitores de tela (o rótulo visível repete "Abaixo de"). */
  nome?: string
  erro?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[28px_minmax(0,1fr)_120px] items-center gap-3">
        <span className={cn('size-7 rounded-[8px]', cor)} aria-hidden />
        <span className="font-semibold">
          {nome && <span className="sr-only">{nome}: </span>}
          {rotulo}
        </span>
        {children}
      </div>
      {erro && <div className="pl-10"><MensagemCampo erro={erro} /></div>}
    </div>
  )
}

function CampoLimite({ invalido, onBlur, ...props }: React.ComponentProps<'input'> & { invalido?: boolean }) {
  return (
    <input
      inputMode="decimal"
      autoComplete="off"
      aria-invalid={invalido || undefined}
      className={cn(
        'h-control w-full rounded-md border border-border-control bg-surface px-3 text-right text-base text-ink lg:text-body',
        invalido && 'border-primary ring-1 ring-primary',
      )}
      onBlur={e => {
        const centavos = lerValor(e.currentTarget.value)
        if (centavos !== null && centavos > 0) e.currentTarget.value = formatarLimite(centavos)
        onBlur?.(e)
      }}
      {...props}
    />
  )
}
