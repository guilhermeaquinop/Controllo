// Esquemas Zod do Primeiro acesso e dos Ajustes. Os campos de dinheiro chegam como texto
// ("1.234,56", "1.000") e saem em centavos inteiros. Os mesmos esquemas valem no navegador e no servidor.
import { z } from 'zod'
import { formatarLimite } from '@/lib/formato'
import { dinheiro } from '@/lib/validacao'
import { hojeEmSaoPaulo } from '@/lib/datas'

const limiteDeFaixa = dinheiro('Digite um valor.').refine(c => c > 0, { error: 'Use um valor maior que zero.' })

const dataDoSaldo = z.iso
  .date({ error: 'Escolha uma data.' })
  .refine(d => d <= hojeEmSaoPaulo(), { error: 'Use hoje ou um dia que já passou.' })

export const esquemaSaldoInicial = z.object({
  saldo: dinheiro('Digite o saldo. Pode ser 0.'),
  data: dataDoSaldo,
})

export const esquemaAjustes = z
  .object({
    saldo: esquemaSaldoInicial.shape.saldo,
    data: esquemaSaldoInicial.shape.data,
    faixa1: limiteDeFaixa,
    faixa2: limiteDeFaixa,
    faixa3: limiteDeFaixa,
  })
  .superRefine((d, ctx) => {
    if (d.faixa2 <= d.faixa1) {
      ctx.addIssue({ code: 'custom', path: ['faixa2'], message: `Precisa ser maior que ${formatarLimite(d.faixa1)}.` })
    }
    if (d.faixa3 <= d.faixa2) {
      ctx.addIssue({ code: 'custom', path: ['faixa3'], message: `Precisa ser maior que ${formatarLimite(d.faixa2)}.` })
    }
  })

export const GRUPOS = ['saida', 'entrada'] as const
export type Grupo = (typeof GRUPOS)[number]

export const NOME_GRUPO: Record<Grupo, string> = { saida: 'Saídas e diário', entrada: 'Entradas' }

export type Categoria = { id: string; nome: string; grupo: Grupo; arquivada: boolean }

const nomeCategoria = z.string().trim().min(1, { error: 'Digite o nome.' }).max(40, { error: 'Use até 40 caracteres.' })

export const esquemaNovaCategoria = z.object({ nome: nomeCategoria, grupo: z.enum(GRUPOS) })
export const esquemaRenomearCategoria = z.object({ id: z.uuid(), nome: nomeCategoria })
export const esquemaArquivarCategoria = z.object({ id: z.uuid(), arquivada: z.boolean() })
export const esquemaIdCategoria = z.object({ id: z.uuid() })

export type DadosSaldoInicial = z.input<typeof esquemaSaldoInicial>
export type DadosAjustes = z.input<typeof esquemaAjustes>
