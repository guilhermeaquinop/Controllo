import type { Metadata } from 'next'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { EmBreve } from '@/components/layout/EmBreve'

export const metadata: Metadata = { title: 'Ano' }

export default function PaginaAno() {
  return (
    <>
      <BarraSuperior titulo="Ano" />
      <Conteudo>
        <CabecalhoPagina titulo="Ano" />
        <EmBreve etapa={5}>O mapa do ano e a previsão chegam aqui.</EmBreve>
      </Conteudo>
    </>
  )
}
