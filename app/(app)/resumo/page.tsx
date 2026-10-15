import type { Metadata } from 'next'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { EmBreve } from '@/components/layout/EmBreve'

export const metadata: Metadata = { title: 'Resumo' }

export default function PaginaResumo() {
  return (
    <>
      <BarraSuperior titulo="Resumo" />
      <Conteudo>
        <CabecalhoPagina titulo="Resumo" />
        <EmBreve etapa={4}>A performance do mês, o gráfico do saldo e as categorias chegam aqui.</EmBreve>
      </Conteudo>
    </>
  )
}
