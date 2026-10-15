import type { Metadata } from 'next'
import { CabecalhoAcesso, LinkAcesso, RodapeAcesso } from '@/components/acesso/Moldura'
import { FormCriarConta } from '@/components/acesso/FormCriarConta'

export const metadata: Metadata = { title: 'Criar conta' }

export default function PaginaCriarConta() {
  return (
    <>
      <CabecalhoAcesso titulo="Criar conta" descricao="Leva um minuto. Depois, confirme o e-mail para entrar." />
      <FormCriarConta />
      <RodapeAcesso>
        Já tem conta? <LinkAcesso href="/entrar">Entrar</LinkAcesso>
      </RodapeAcesso>
    </>
  )
}
