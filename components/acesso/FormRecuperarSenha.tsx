'use client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recuperarSenha } from '@/lib/acesso/acoes'
import { esquemaRecuperarSenha } from '@/lib/acesso/esquemas'
import { AvisoFormulario, BotaoPrincipal, CampoTexto } from './Campos'
import { EmailEnviado } from './EmailEnviado'

export function FormRecuperarSenha() {
  const [pendente, iniciar] = useTransition()
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null)
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaRecuperarSenha),
    defaultValues: { email: '' },
  })

  const enviar = handleSubmit(dados =>
    iniciar(async () => {
      const r = await recuperarSenha(dados)
      if (r.ok) setEnviadoPara(dados.email)
      else setError('root.servidor', { message: r.erro })
    }),
  )

  if (enviadoPara) {
    return (
      <EmailEnviado titulo="Confira seu e-mail">
        Se existir uma conta com <strong className="font-semibold text-ink">{enviadoPara}</strong>, enviamos um link para
        criar uma nova senha. O link vale por 1 hora. Não chegou? Veja o spam.
      </EmailEnviado>
    )
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Recuperar senha" className="flex flex-col gap-4 lg:gap-[18px]">
      <AvisoFormulario>{errors.root?.servidor?.message}</AvisoFormulario>
      <CampoTexto
        rotulo="E-mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        placeholder="voce@email.com"
        erro={errors.email?.message}
        {...register('email')}
      />
      <BotaoPrincipal pendente={pendente} className="mt-2">{pendente ? 'Enviando' : 'Enviar link'}</BotaoPrincipal>
    </form>
  )
}
