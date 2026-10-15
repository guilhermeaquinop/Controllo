'use client'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { concluirPrimeiroAcesso, pularPrimeiroAcesso } from '@/lib/configuracao/acoes'
import { esquemaSaldoInicial } from '@/lib/configuracao/esquemas'
import { AvisoFormulario, BotaoPrincipal, CampoData, CampoDinheiro } from '@/components/formulario/Campos'

/** `hoje` vem do servidor, já em São Paulo, para o campo de data começar certo. */
export function FormPrimeiroAcesso({ hoje }: { hoje: string }) {
  const [pendente, iniciar] = useTransition()
  const [pulando, iniciarPulo] = useTransition()
  const { register, handleSubmit, getValues, setError, control, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaSaldoInicial),
    defaultValues: { saldo: '', data: hoje },
  })

  // O handleSubmit só chama depois de validar; mandamos o texto digitado (getValues),
  // e o servidor valida e converte de novo com o mesmo esquema.
  const enviar = handleSubmit(() =>
    iniciar(async () => {
      const r = await concluirPrimeiroAcesso(getValues())
      if (r?.ok === false) setError('root.servidor', { message: r.erro })
    }),
  )

  const pular = () =>
    iniciarPulo(async () => {
      const r = await pularPrimeiroAcesso()
      if (r?.ok === false) setError('root.servidor', { message: r.erro })
    })

  return (
    <form onSubmit={enviar} noValidate aria-label="Saldo da conta" className="flex flex-col gap-4 lg:gap-[18px]">
      <AvisoFormulario>{errors.root?.servidor?.message}</AvisoFormulario>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3">
        <CampoDinheiro grande rotulo="Valor" placeholder="0,00" erro={errors.saldo?.message} {...register('saldo')} />
        <Controller control={control} name="data" render={({ field }) => <CampoData grande rotulo="No dia" max={hoje} erro={errors.data?.message} {...field} />} />
      </div>
      <p className="text-caption text-ink-muted">
        Use o saldo antes dos gastos desse dia: o que entrar e sair nele você lança depois.
      </p>
      <BotaoPrincipal pendente={pendente} disabled={pendente || pulando} className="mt-2 lg:h-12">
        {pendente ? 'Começando' : 'Começar'}
      </BotaoPrincipal>
      <button
        type="button"
        onClick={pular}
        disabled={pendente || pulando}
        className="flex min-h-control flex-col items-center justify-center text-center disabled:opacity-60"
      >
        <span className="text-label underline underline-offset-2">{pulando ? 'Pulando' : 'Pular por agora'}</span>
        <span className="text-caption text-ink-muted">Começa com saldo zero hoje. Dá para mudar em Ajustes.</span>
      </button>
    </form>
  )
}
