'use client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entrar } from '@/lib/acesso/acoes'
import { esquemaEntrar } from '@/lib/acesso/esquemas'
import { AvisoFormulario, BotaoPrincipal, CampoSenha, CampoTexto } from './Campos'
import { LinkAcesso } from './Moldura'

export function FormEntrar({ erroInicial }: { erroInicial?: string }) {
  const [pendente, iniciar] = useTransition()
  const [mostrarErroInicial, setMostrarErroInicial] = useState(true)
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaEntrar),
    defaultValues: { email: '', senha: '', manterConectado: true },
  })

  const enviar = handleSubmit(dados => {
    setMostrarErroInicial(false)
    iniciar(async () => {
      const r = await entrar(dados) // se der certo, o servidor redireciona para o Mês
      if (r?.ok === false) setError('root.servidor', { message: r.erro })
    })
  })

  return (
    <form onSubmit={enviar} noValidate aria-label="Entrar" className="flex flex-col gap-4 lg:gap-[18px]">
      <AvisoFormulario>{errors.root?.servidor?.message ?? (mostrarErroInicial ? erroInicial : undefined)}</AvisoFormulario>
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
      <CampoSenha rotulo="Senha" autoComplete="current-password" erro={errors.senha?.message} {...register('senha')} />

      <div className="flex flex-wrap items-center justify-end gap-3 lg:justify-between">
        {/* No celular fica sempre marcado (o mockup não mostra a opção). */}
        <label className="hidden min-h-control cursor-pointer items-center gap-2 lg:flex">
          <input type="checkbox" className="size-[18px] accent-primary" {...register('manterConectado')} />
          Manter conectado
        </label>
        <LinkAcesso href="/recuperar-senha" className="flex min-h-8 items-center text-label">Esqueci minha senha</LinkAcesso>
      </div>

      <BotaoPrincipal pendente={pendente}>{pendente ? 'Entrando' : 'Entrar'}</BotaoPrincipal>
    </form>
  )
}
