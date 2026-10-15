import type { Metadata } from 'next'
import { CabecalhoAcesso, LinkAcesso, RodapeAcesso } from '@/components/acesso/Moldura'
import { FormEntrar } from '@/components/acesso/FormEntrar'
import { mensagemDeErroAuth } from '@/lib/acesso/mensagens'

export const metadata: Metadata = { title: 'Entrar' }

export default async function PaginaEntrar({ searchParams }: PageProps<'/entrar'>) {
  const { erro } = await searchParams
  return (
    <>
      <CabecalhoAcesso
        tituloCelular="Seu dinheiro, dia a dia."
        descricaoCelular="Entre para ver o saldo de cada dia e lançar o que entrou e saiu."
        titulo="Entrar"
        descricao="Use o e-mail e a senha da sua conta."
      />
      <FormEntrar erroInicial={erro === 'link' ? mensagemDeErroAuth('otp_expired') : undefined} />
      <RodapeAcesso>
        Ainda não tem conta? <LinkAcesso href="/criar-conta">Criar conta</LinkAcesso>
      </RodapeAcesso>
    </>
  )
}
