import type { Metadata } from 'next'
import { LogOut } from 'lucide-react'
import { BarraSuperior, CabecalhoPagina, Conteudo } from '@/components/layout/BarraSuperior'
import { Cartao } from '@/components/layout/Cartao'
import { FormAjustes } from '@/components/configuracao/FormAjustes'
import { CartaoCategorias } from '@/components/configuracao/CartaoCategorias'
import { sair } from '@/lib/acesso/acoes'
import { exigirUsuario } from '@/lib/acesso/usuario'
import { exigirConfiguracao, listarCategorias } from '@/lib/configuracao/dados'
import { hojeEmSaoPaulo } from '@/lib/datas'

export const metadata: Metadata = { title: 'Ajustes' }

export default async function PaginaAjustes() {
  const [usuario, configuracao, categorias] = await Promise.all([exigirUsuario(), exigirConfiguracao(), listarCategorias()])
  return (
    <>
      <BarraSuperior titulo="Ajustes" voltarPara="/mes" />
      <Conteudo className="w-full lg:max-w-[720px]">
        <CabecalhoPagina titulo="Ajustes" />
        <FormAjustes
          saldoInicial={configuracao.saldoInicial}
          saldoInicialData={configuracao.saldoInicialData}
          limites={configuracao.limites}
          hoje={hojeEmSaoPaulo()}
          entre={<CartaoCategorias categorias={categorias} />}
        />
        {/* Etapa 7: reservas. Etapa 8: perfil, senha, exportar CSV e excluir conta. */}
        <Cartao titulo="Conta" className="gap-3">
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
        </Cartao>
      </Conteudo>
    </>
  )
}
