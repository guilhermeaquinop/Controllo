import { redirect } from 'next/navigation'
import { ROTA_INICIAL } from '@/lib/acesso/rotas'

// O proxy.ts já manda "/" para o Mês (ou para Entrar). Isto é só uma garantia.
export default function Inicio() {
  redirect(ROTA_INICIAL)
}
