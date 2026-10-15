'use client'
// Criar ou editar uma categoria. Celular: folha que sobe; web: diálogo.
import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react'
import {
  arquivarCategoria,
  criarCategoria,
  excluirCategoria,
  renomearCategoria,
} from '@/lib/configuracao/acoes'
import { NOME_GRUPO, esquemaNovaCategoria, type Categoria, type Grupo } from '@/lib/configuracao/esquemas'
import type { Resultado } from '@/lib/resultado'
import { Folha } from '@/components/layout/Folha'
import { AvisoFormulario, BotaoPrincipal, BotaoSecundario, CampoTexto, Segmentado } from '@/components/formulario/Campos'

export type EdicaoCategoria = { modo: 'nova' } | { modo: 'editar'; categoria: Categoria }

type Props = { aberta: boolean; edicao: EdicaoCategoria; onFechar: () => void }

export function FolhaCategoria({ aberta, edicao, onFechar }: Props) {
  const categoria = edicao.modo === 'editar' ? edicao.categoria : null
  return (
    <Folha
      aberta={aberta}
      onFechar={onFechar}
      titulo={categoria ? 'Editar categoria' : 'Nova categoria'}
      descricao={categoria ? NOME_GRUPO[categoria.grupo] : undefined}
    >
      {/* key: cada abertura começa com o formulário limpo */}
      <FormCategoria key={categoria?.id ?? 'nova'} categoria={categoria} onConcluir={onFechar} />
    </Folha>
  )
}

function FormCategoria({ categoria, onConcluir }: { categoria: Categoria | null; onConcluir: () => void }) {
  const [pendente, iniciar] = useTransition()
  const [erro, setErro] = useState<string>()
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaNovaCategoria),
    defaultValues: { nome: categoria?.nome ?? '', grupo: (categoria?.grupo ?? 'saida') as Grupo },
  })
  const grupo = useWatch({ control, name: 'grupo' })

  const executar = (acao: () => Promise<Resultado>) =>
    iniciar(async () => {
      setErro(undefined)
      const r = await acao()
      if (r.ok) onConcluir()
      else setErro(r.erro)
    })

  const salvar = handleSubmit(dados =>
    executar(() => (categoria ? renomearCategoria({ id: categoria.id, nome: dados.nome }) : criarCategoria(dados))),
  )

  return (
    <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
      <AvisoFormulario>{erro}</AvisoFormulario>
      {!categoria && (
        <Segmentado
          rotulo="Grupo da categoria"
          opcoes={[
            { valor: 'saida', rotulo: NOME_GRUPO.saida },
            { valor: 'entrada', rotulo: NOME_GRUPO.entrada },
          ]}
          valor={grupo}
          onChange={g => setValue('grupo', g)}
        />
      )}
      <CampoTexto
        rotulo="Nome"
        autoComplete="off"
        maxLength={40}
        erro={errors.nome?.message}
        dica={!categoria ? 'Saídas e diário serve para os dois tipos de gasto.' : undefined}
        {...register('nome')}
      />
      <BotaoPrincipal pendente={pendente}>{pendente ? 'Salvando' : 'Salvar categoria'}</BotaoPrincipal>

      {categoria && (
        <div className="flex flex-col gap-3 border-t border-divider pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <BotaoSecundario
              disabled={pendente}
              onClick={() => executar(() => arquivarCategoria({ id: categoria.id, arquivada: !categoria.arquivada }))}
            >
              {categoria.arquivada ? (
                <><ArchiveRestore size={16} strokeWidth={1.7} aria-hidden /> Restaurar categoria</>
              ) : (
                <><Archive size={16} strokeWidth={1.7} aria-hidden /> Arquivar categoria</>
              )}
            </BotaoSecundario>
            <button
              type="button"
              disabled={pendente}
              onClick={() => (confirmarExclusao ? executar(() => excluirCategoria({ id: categoria.id })) : setConfirmarExclusao(true))}
              className="flex min-h-control items-center gap-1.5 px-1 text-label underline-offset-2 hover:underline disabled:opacity-60"
            >
              <Trash2 size={16} strokeWidth={1.7} aria-hidden />
              {confirmarExclusao ? 'Confirmar exclusão' : 'Excluir'}
            </button>
          </div>
          <p className="text-caption text-ink-muted">
            {categoria.arquivada
              ? 'Arquivada: não aparece nos formulários, mas os lançamentos antigos continuam com ela.'
              : 'Arquivar tira dos formulários e mantém o histórico. Excluir só funciona sem lançamentos.'}
          </p>
        </div>
      )}
    </form>
  )
}
