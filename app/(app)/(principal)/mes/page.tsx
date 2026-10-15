import type { Metadata } from 'next'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { EmBreve } from '@/components/layout/EmBreve'

export const metadata: Metadata = { title: 'Mês' }

export default function PaginaMes() {
  return (
    <>
      <BarraSuperior titulo="Mês" />
      <Conteudo>
        <CabecalhoPagina titulo="Mês" />
        <EmBreve etapa={3}>O calendário com o saldo de cada dia e os lançamentos chegam aqui.</EmBreve>
      </Conteudo>
    </>
  )
}
