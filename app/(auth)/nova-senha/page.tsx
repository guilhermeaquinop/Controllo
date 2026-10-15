import type { Metadata } from 'next'
import { CabecalhoAcesso } from '@/components/acesso/Moldura'
import { FormNovaSenha } from '@/components/acesso/FormNovaSenha'
import { exigirUsuario } from '@/lib/acesso/usuario'

export const metadata: Metadata = { title: 'Nova senha' }

// Chega aqui pelo link do e-mail de recuperação, que já abre a sessão.
export default async function PaginaNovaSenha() {
  const usuario = await exigirUsuario()
  return (
    <>
      <CabecalhoAcesso titulo="Nova senha" descricao={`Escolha uma senha nova para ${usuario.email}.`} />
      <FormNovaSenha />
    </>
  )
}
