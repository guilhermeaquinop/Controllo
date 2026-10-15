import { MolduraAcesso } from '@/components/acesso/Moldura'

// Telas de acesso: Entrar, Criar conta, Recuperar senha e Nova senha.
export default function LayoutAcesso({ children }: { children: React.ReactNode }) {
  return <MolduraAcesso>{children}</MolduraAcesso>
}
