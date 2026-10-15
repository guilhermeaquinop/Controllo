import { Casca } from '@/components/layout/Casca'
import { exigirConfiguracao } from '@/lib/configuracao/dados'

// Telas com menu (Mês, Ano, Economia, Resumo, Ajustes). Quem ainda não fez o
// Primeiro acesso é mandado para lá antes de ver qualquer uma delas.
export default async function LayoutPrincipal({ children }: { children: React.ReactNode }) {
  await exigirConfiguracao()
  return <Casca>{children}</Casca>
}
