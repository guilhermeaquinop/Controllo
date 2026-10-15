'use client'
// Categorias em Ajustes: lista por grupo; tocar numa abre a edição, "+ Nova" abre a criação.
import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOME_GRUPO, type Categoria } from '@/lib/configuracao/esquemas'
import { Cartao } from '@/components/layout/Cartao'
import { BotaoSecundario } from '@/components/formulario/Campos'
import { FolhaCategoria, type EdicaoCategoria } from './FolhaCategoria'

export function CartaoCategorias({ categorias }: { categorias: Categoria[] }) {
  const [edicao, setEdicao] = useState<EdicaoCategoria | null>(null)
  // Mantém o conteúdo enquanto a folha fecha (a animação não fica vazia).
  const [ultima, setUltima] = useState<EdicaoCategoria>({ modo: 'nova' })
  const abrir = (e: EdicaoCategoria) => {
    setUltima(e)
    setEdicao(e)
  }

  return (
    <Cartao
      titulo="Categorias"
      className="gap-3"
      acao={
        <BotaoSecundario onClick={() => abrir({ modo: 'nova' })}>
          <Plus size={16} strokeWidth={2} aria-hidden /> Nova
        </BotaoSecundario>
      }
    >
      {(['saida', 'entrada'] as const).map((grupo, i) => (
        <div key={grupo} className="flex flex-col">
          <h3 className={cn('text-label text-ink-muted', i > 0 && 'pt-1')}>{NOME_GRUPO[grupo]}</h3>
          <ul className="flex flex-col">
            {categorias
              .filter(c => c.grupo === grupo)
              .map(c => (
                <li key={c.id} className="border-b border-divider last:border-b-0">
                  <button
                    type="button"
                    onClick={() => abrir({ modo: 'editar', categoria: c })}
                    className="flex min-h-12 w-full items-center justify-between gap-3 text-left hover:text-ink-muted"
                  >
                    <span className={cn('min-w-0 truncate', c.arquivada && 'text-ink-muted')}>{c.nome}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {c.arquivada && (
                        <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-ink">arquivada</span>
                      )}
                      <ChevronRight size={18} strokeWidth={1.7} aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}

      <FolhaCategoria aberta={edicao !== null} edicao={edicao ?? ultima} onFechar={() => setEdicao(null)} />
    </Cartao>
  )
}
