import { Casca } from '@/components/layout/Casca'
import { exigirUsuario } from '@/lib/acesso/usuario'

// Todas as telas logadas passam por aqui. O proxy.ts já barra quem não entrou;
// exigirUsuario() confere de novo, validando o token.
export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  await exigirUsuario()
  return <Casca>{children}</Casca>
}
