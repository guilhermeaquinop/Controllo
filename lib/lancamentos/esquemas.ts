// Esquemas Zod dos lançamentos. Valem no formulário (navegador) e na Server Action (servidor).
import { z } from 'zod'
import { dinheiro } from '@/lib/validacao'
import type { TipoLancamento } from '@/lib/calculo/saldo'
import type { Grupo } from '@/lib/configuracao/esquemas'

export const TIPOS = ['entrada', 'saida', 'diario'] as const satisfies readonly TipoLancamento[]

export const NOME_TIPO: Record<TipoLancamento, string> = { entrada: 'Entrada', saida: 'Saída', diario: 'Diário' }

/** Entrada usa as categorias de entrada; Saída e Diário, as de saída. */
export function grupoDoTipo(tipo: TipoLancamento): Grupo {
  return tipo === 'entrada' ? 'entrada' : 'saida'
}

const valor = dinheiro('Digite o valor.').refine(c => c > 0, { error: 'Use um valor maior que zero.' })

const data = z.iso
  .date({ error: 'Escolha uma data.' })
  .refine(d => d >= '2000-01-01' && d <= '2099-12-31', { error: 'Use uma data entre 2000 e 2099.' })

const campos = {
  data,
  tipo: z.enum(TIPOS),
  valor,
  categoriaId: z.uuid({ error: 'Escolha uma categoria.' }),
  descricao: z.string().trim().max(80, { error: 'Use até 80 caracteres.' }),
}

export const esquemaNovoLancamento = z.object(campos)
export const esquemaEditarLancamento = z.object({ id: z.uuid(), ...campos })
export const esquemaIdLancamento = z.object({ id: z.uuid() })

export type DadosLancamento = z.input<typeof esquemaNovoLancamento>
