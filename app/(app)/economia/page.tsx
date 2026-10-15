import type { Metadata } from 'next'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { EmBreve } from '@/components/layout/EmBreve'

export const metadata: Metadata = { title: 'Economia' }

export default function PaginaEconomia() {
  return (
    <>
      <BarraSuperior titulo="Economia" />
      <Conteudo>
        <CabecalhoPagina titulo="Economia" />
        <EmBreve etapa={7}>As reservas, com aportes e resgates, chegam aqui.</EmBreve>
      </Conteudo>
    </>
  )
}
