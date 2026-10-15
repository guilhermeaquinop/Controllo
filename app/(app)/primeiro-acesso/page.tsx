import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CabecalhoAcesso, MolduraAcesso } from '@/components/acesso/Moldura'
import { FormPrimeiroAcesso } from '@/components/configuracao/FormPrimeiroAcesso'
import { ROTA_INICIAL } from '@/lib/acesso/rotas'
import { obterConfiguracao } from '@/lib/configuracao/dados'
import { hojeEmSaoPaulo } from '@/lib/datas'

export const metadata: Metadata = { title: 'Primeiro acesso' }

// Um passo só: saldo da conta e a data. Quem já passou por aqui vai direto para o Mês.
export default async function PaginaPrimeiroAcesso() {
  if (await obterConfiguracao()) redirect(ROTA_INICIAL)
  return (
    <MolduraAcesso>
      <CabecalhoAcesso
        titulo="Saldo da conta"
        descricao="Quanto havia na conta no começo do dia escolhido. Daí em diante o Controllo calcula o saldo de cada dia."
      />
      <FormPrimeiroAcesso hoje={hojeEmSaoPaulo()} />
    </MolduraAcesso>
  )
}
