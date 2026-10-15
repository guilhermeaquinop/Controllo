'use client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarConta } from '@/lib/acesso/acoes'
import { esquemaCriarConta } from '@/lib/acesso/esquemas'
import { AvisoFormulario, BotaoPrincipal, CampoSenha, CampoTexto } from './Campos'
import { EmailEnviado } from './EmailEnviado'
import { LinkAcesso } from './Moldura'

export function FormCriarConta() {
  const [pendente, iniciar] = useTransition()
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null)
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaCriarConta),
    defaultValues: { nome: '', email: '', senha: '' },
  })

  const enviar = handleSubmit(dados =>
    iniciar(async () => {
      const r = await criarConta(dados)
      if (r.ok) setEnviadoPara(dados.email)
      else setError('root.servidor', { message: r.erro })
    }),
  )

  if (enviadoPara) {
    return (
      <EmailEnviado titulo="Confira seu e-mail">
        Enviamos um link de confirmação para <strong className="font-semibold text-ink">{enviadoPara}</strong>. Abra o
        e-mail e toque em Confirmar e-mail para entrar. Não chegou? Veja o spam. Se você já tem conta,{' '}
        <LinkAcesso href="/entrar">entre</LinkAcesso> ou <LinkAcesso href="/recuperar-senha">recupere a senha</LinkAcesso>.
      </EmailEnviado>
    )
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Criar conta" className="flex flex-col gap-4 lg:gap-[18px]">
      <AvisoFormulario>{errors.root?.servidor?.message}</AvisoFormulario>
      <CampoTexto rotulo="Nome" autoComplete="name" autoCapitalize="words" erro={errors.nome?.message} {...register('nome')} />
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
      <CampoSenha
        rotulo="Senha"
        autoComplete="new-password"
        dica="Pelo menos 8 caracteres."
        erro={errors.senha?.message}
        {...register('senha')}
      />
      <BotaoPrincipal pendente={pendente} className="mt-2">{pendente ? 'Criando conta' : 'Criar conta'}</BotaoPrincipal>
    </form>
  )
}
