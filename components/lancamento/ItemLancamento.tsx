'use client'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Dinheiro } from '@/components/dinheiro/Dinheiro'

export type TipoLancamento = 'entrada' | 'saida' | 'diario'

const NOME_TIPO: Record<TipoLancamento, string> = { entrada: 'Entrada', saida: 'Saída', diario: 'Diário' }

type Props = {
  tipo: TipoLancamento
  titulo: string           // descrição, ou o nome da categoria quando não há descrição
  categoria: string
  centavos: number         // sempre positivo; o sinal vem do tipo
  onAbrir?: () => void
}

/** Linha da lista do dia: ícone, título, "Tipo · Categoria" e valor em verde ou vermelho. */
export function ItemLancamento({ tipo, titulo, categoria, centavos, onAbrir }: Props) {
  const entra = tipo === 'entrada'
  return (
    <button
      type="button"
      onClick={onAbrir}
      className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-divider py-3 text-left last:border-b-0"
    >
      <span className={entra ? 'grid size-8 place-items-center rounded-full bg-money-in-soft text-money-in' : 'grid size-8 place-items-center rounded-full bg-money-out-soft text-money-out'} aria-hidden>
        {entra ? <ArrowUp size={16} strokeWidth={2.2} /> : <ArrowDown size={16} strokeWidth={2.2} />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-semibold">{titulo}</span>
        <span className="truncate text-caption text-ink-muted">{NOME_TIPO[tipo]} · {categoria}</span>
      </span>
      <Dinheiro centavos={entra ? centavos : -centavos} modo="sinal" className="font-bold" />
    </button>
  )
}
