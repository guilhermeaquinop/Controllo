'use client'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { definirNovaSenha } from '@/lib/acesso/acoes'
import { esquemaNovaSenha } from '@/lib/acesso/esquemas'
import { AvisoFormulario, BotaoPrincipal, CampoSenha } from '@/components/formulario/Campos'

export function FormNovaSenha() {
  const [pendente, iniciar] = useTransition()
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaNovaSenha),
    defaultValues: { senha: '', confirmacao: '' },
  })

  const enviar = handleSubmit(dados =>
    iniciar(async () => {
      const r = await definirNovaSenha(dados) // se der certo, o servidor redireciona para o Mês
      if (r?.ok === false) setError('root.servidor', { message: r.erro })
    }),
  )

  return (
    <form onSubmit={enviar} noValidate aria-label="Nova senha" className="flex flex-col gap-4 lg:gap-[18px]">
      <AvisoFormulario>{errors.root?.servidor?.message}</AvisoFormulario>
      <CampoSenha grande
        rotulo="Nova senha"
        autoComplete="new-password"
        dica="Pelo menos 8 caracteres."
        erro={errors.senha?.message}
        {...register('senha')}
      />
      <CampoSenha grande rotulo="Repita a nova senha" autoComplete="new-password" erro={errors.confirmacao?.message} {...register('confirmacao')} />
      <BotaoPrincipal pendente={pendente} className="mt-2 lg:h-12">{pendente ? 'Salvando' : 'Salvar nova senha'}</BotaoPrincipal>
    </form>
  )
}
