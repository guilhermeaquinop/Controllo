'use client'
// Formulário de lançamento da folha do dia (celular) e do painel do dia (web).
// Sem `lancamento`: cria no dia aberto. Com `lancamento`: edita (inclui data, excluir e cancelar).
// Parcelas e "Repete todo mês" entram na etapa 6.
import { useState, useTransition, type FocusEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import type { TipoLancamento } from '@/lib/calculo/saldo'
import type { Categoria } from '@/lib/configuracao/esquemas'
import { criarLancamento, editarLancamento, excluirLancamento } from '@/lib/lancamentos/acoes'
import { esquemaNovoLancamento, grupoDoTipo } from '@/lib/lancamentos/esquemas'
import type { Lancamento } from '@/lib/lancamentos/tipos'
import { formatarNumero, lerValor } from '@/lib/formato'
import type { Resultado } from '@/lib/resultado'
import { cn } from '@/lib/utils'
import { SeletorTipo } from './SeletorTipo'
import {
  AvisoFormulario,
  AvisoSalvo,
  BotaoPrincipal,
  BotaoSecundario,
  CampoData,
  CampoSelecao,
  CampoTexto,
  MensagemCampo,
} from '@/components/formulario/Campos'

const DICA: Record<TipoLancamento, string> = {
  entrada: 'Dinheiro que entra: salário, Pix recebido, renda extra.',
  saida: 'Contas e compromissos: aluguel, fatura do cartão, boletos.',
  diario: 'Gasto do dia a dia: mercado, padaria, transporte, lanche.',
}

const BOTAO: Record<TipoLancamento, string> = {
  entrada: 'Adicionar à entrada',
  saida: 'Adicionar à saída',
  diario: 'Adicionar ao diário',
}

type Props = {
  /** Dia em que o lançamento novo entra. */
  dia: string
  categorias: Categoria[]
  /** Categoria que vem marcada em cada tipo (a última usada no mês). */
  sugestoes?: Partial<Record<TipoLancamento, string>>
  lancamento?: Lancamento
  /** Depois de salvar ou excluir uma edição. */
  onConcluir?: () => void
  onCancelar?: () => void
}

export function FormLancamento({ dia, categorias, sugestoes, lancamento, onConcluir, onCancelar }: Props) {
  const edicao = lancamento !== undefined
  const [pendente, iniciar] = useTransition()
  const [erro, setErro] = useState<string>()
  const [aviso, setAviso] = useState<string>()
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  // Categorias do grupo do tipo. Arquivadas não aparecem, exceto a que o lançamento editado já usa.
  const opcoes = (tipo: TipoLancamento) =>
    categorias.filter(c => c.grupo === grupoDoTipo(tipo) && (!c.arquivada || c.id === lancamento?.categoriaId))
  const padrao = (tipo: TipoLancamento) => {
    const lista = opcoes(tipo)
    return lista.find(c => c.id === sugestoes?.[tipo])?.id ?? lista[0]?.id ?? ''
  }
  const tipoInicial: TipoLancamento = lancamento?.tipo ?? 'diario'

  const { register, handleSubmit, getValues, setValue, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(esquemaNovoLancamento),
    defaultValues: {
      data: lancamento?.data ?? dia,
      tipo: tipoInicial,
      valor: lancamento ? formatarNumero(lancamento.valor) : '',
      categoriaId: lancamento?.categoriaId ?? padrao(tipoInicial),
      descricao: lancamento?.descricao ?? '',
    },
  })
  const tipo = useWatch({ control, name: 'tipo' })

  const trocarTipo = (novo: TipoLancamento) => {
    setValue('tipo', novo)
    setAviso(undefined)
    if (!opcoes(novo).some(c => c.id === getValues('categoriaId')) || !lancamento) setValue('categoriaId', padrao(novo))
  }

  const executar = (acao: () => Promise<Resultado>, depois: () => void) =>
    iniciar(async () => {
      setErro(undefined)
      setAviso(undefined)
      const r = await acao()
      if (r.ok) depois()
      else setErro(r.erro)
    })

  // Manda o texto digitado (getValues): o servidor valida e converte com o mesmo esquema.
  const enviar = handleSubmit(() => {
    if (lancamento) {
      executar(() => editarLancamento({ id: lancamento.id, ...getValues() }), () => onConcluir?.())
    } else {
      executar(
        () => criarLancamento({ ...getValues(), data: dia }),
        () => {
          reset({ ...getValues(), valor: '', descricao: '' }) // tipo e categoria ficam para o próximo
          setAviso('Lançado.')
        },
      )
    }
  })

  const lista = opcoes(tipo)
  const corValor = tipo === 'entrada' ? 'text-money-in' : 'text-money-out'

  return (
    <form onSubmit={enviar} noValidate aria-label={edicao ? 'Editar lançamento' : 'Novo lançamento'} className="flex flex-col gap-3.5">
      <AvisoFormulario>{erro}</AvisoFormulario>
      <SeletorTipo valor={tipo} onChange={trocarTipo} />

      <div className="flex flex-col gap-1.5">
        <label
          className={cn(
            'flex h-16 items-center gap-2 rounded-[14px] border border-border-control bg-surface px-4 lg:h-14 lg:rounded-[12px] lg:px-3.5',
            'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary',
            errors.valor && 'border-primary ring-1 ring-primary',
          )}
        >
          <span className="text-lg font-semibold text-ink-muted lg:text-base" aria-hidden>R$</span>
          <input
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            aria-label="Valor em reais"
            aria-invalid={errors.valor ? true : undefined}
            className={cn('h-full min-w-0 flex-1 bg-transparent text-[28px] font-bold outline-none placeholder:text-ink-muted lg:text-2xl', corValor)}
            {...register('valor', {
              onBlur: (e: FocusEvent<HTMLInputElement>) => {
                const centavos = lerValor(e.currentTarget.value)
                if (centavos !== null && centavos > 0) setValue('valor', formatarNumero(centavos))
              },
            })}
          />
        </label>
        <MensagemCampo erro={errors.valor?.message} />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <CampoSelecao rotulo="Categoria" erro={errors.categoriaId?.message} {...register('categoriaId')}>
          {lista.length === 0 && <option value="">Crie uma em Ajustes</option>}
          {lista.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
              {c.arquivada ? ' (arquivada)' : ''}
            </option>
          ))}
        </CampoSelecao>
        <CampoTexto rotulo="Descrição" placeholder="Opcional" maxLength={80} autoComplete="off" erro={errors.descricao?.message} {...register('descricao')} />
      </div>
      {edicao ? (
        <Controller control={control} name="data" render={({ field }) => <CampoData rotulo="Data" erro={errors.data?.message} {...field} />} />
      ) : (
        <p className="-mt-1.5 text-caption text-ink-muted">{DICA[tipo]}</p>
      )}

      <BotaoPrincipal pendente={pendente} className="lg:h-[46px]">
        {pendente ? 'Salvando' : edicao ? 'Salvar alterações' : BOTAO[tipo]}
      </BotaoPrincipal>
      {!edicao && <AvisoSalvo>{aviso}</AvisoSalvo>}

      {lancamento && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BotaoSecundario onClick={onCancelar} disabled={pendente}>Cancelar</BotaoSecundario>
          <button
            type="button"
            disabled={pendente}
            onClick={() =>
              confirmarExclusao
                ? executar(() => excluirLancamento({ id: lancamento.id }), () => onConcluir?.())
                : setConfirmarExclusao(true)
            }
            className="flex min-h-control items-center gap-1.5 px-1 text-label underline-offset-2 hover:underline disabled:opacity-60"
          >
            <Trash2 size={16} strokeWidth={1.7} aria-hidden />
            {confirmarExclusao ? 'Confirmar exclusão' : 'Excluir lançamento'}
          </button>
        </div>
      )}
    </form>
  )
}
