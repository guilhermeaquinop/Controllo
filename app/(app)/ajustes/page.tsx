import type { Metadata } from 'next'
import { LogOut } from 'lucide-react'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { EmBreve } from '@/components/layout/EmBreve'
import { sair } from '@/lib/acesso/acoes'
import { exigirUsuario } from '@/lib/acesso/usuario'

export const metadata: Metadata = { title: 'Ajustes' }

export default async function PaginaAjustes() {
  const usuario = await exigirUsuario()
  return (
    <>
      <BarraSuperior titulo="Ajustes" voltarPara="/mes" />
      <Conteudo className="lg:max-w-[720px]">
        <CabecalhoPagina titulo="Ajustes" />
        <EmBreve etapa={2}>Saldo inicial, faixas de cor e categorias chegam aqui.</EmBreve>
        <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-section">Conta</h2>
          <p className="text-ink-muted">{usuario.email}</p>
          {/* Server Action direto no form: funciona até sem JavaScript. */}
          <form action={sair}>
            <button
              type="submit"
              className="flex h-10 items-center gap-2 rounded-full border border-primary bg-surface px-3.5 text-label hover:bg-surface-sunken"
            >
              <LogOut size={16} strokeWidth={1.7} /> Sair
            </button>
          </form>
        </section>
      </Conteudo>
    </>
  )
}
