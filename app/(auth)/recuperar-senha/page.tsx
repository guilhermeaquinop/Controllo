import type { Metadata } from 'next'
import { CabecalhoAcesso, LinkAcesso, RodapeAcesso } from '@/components/acesso/Moldura'
import { FormRecuperarSenha } from '@/components/acesso/FormRecuperarSenha'

export const metadata: Metadata = { title: 'Recuperar senha' }

export default function PaginaRecuperarSenha() {
  return (
    <>
      <CabecalhoAcesso
        titulo="Recuperar senha"
        descricao="Digite o e-mail da conta. Enviamos um link para criar uma nova senha."
      />
      <FormRecuperarSenha />
      <RodapeAcesso>
        Lembrou a senha? <LinkAcesso href="/entrar">Entrar</LinkAcesso>
      </RodapeAcesso>
    </>
  )
}
