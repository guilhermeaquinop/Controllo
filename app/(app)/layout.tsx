import { exigirUsuario } from '@/lib/acesso/usuario'

// Todas as telas logadas (com ou sem menu) passam por aqui. O proxy.ts já barra quem
// não entrou; exigirUsuario() confere de novo, validando o token.
export default async function LayoutLogado({ children }: { children: React.ReactNode }) {
  await exigirUsuario()
  return children
}
