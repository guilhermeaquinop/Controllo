'use client'
// Campos, botões e mensagens de formulário, usados em todo o app.
// Medidas: padrão = 48px e cantos de 10px (Ajustes, folha do dia);
// grande = 52px no celular e 48px na web, cantos de 12px (telas de acesso).
import { useId, useRef, useState, type ComponentProps, type FocusEvent, type ReactNode, type Ref } from 'react'
import { CalendarDays, Check, CircleAlert, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatarNumero, lerValor } from '@/lib/formato'
import { formatarData, lerData, mascararData } from '@/lib/datas'

// 16px no celular: abaixo disso o Safari do iPhone dá zoom ao tocar no campo.
const TEXTO_CAMPO = 'text-base text-ink placeholder:text-ink-muted lg:text-body'
const MOLDURA = {
  padrao: 'h-12 rounded-md',
  grande: 'h-control-lg rounded-[12px] lg:h-12',
}
const BORDA = 'border border-border-control bg-surface'
const BORDA_ERRO = 'border-primary ring-1 ring-primary'
// Moldura com o input dentro (senha, dinheiro): o contorno de foco vai na moldura.
const FOCO_DENTRO = 'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary'

type PropsCampo = ComponentProps<'input'> & {
  rotulo: string
  erro?: string
  dica?: string
  grande?: boolean
}

function useIds(id?: string) {
  const gerado = useId()
  const campo = id ?? gerado
  return { campo, ajuda: `${campo}-ajuda` }
}

const descricao = (ids: { ajuda: string }, erro?: string, dica?: string) => ({
  'aria-invalid': erro ? true : undefined,
  'aria-describedby': erro || dica ? ids.ajuda : undefined,
})

export function CampoTexto({ rotulo, erro, dica, grande, id, className, ...props }: PropsCampo) {
  const ids = useIds(id)
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ids.campo} className="text-label">{rotulo}</label>
      <input
        id={ids.campo}
        {...descricao(ids, erro, dica)}
        className={cn('w-full px-3.5', BORDA, MOLDURA[grande ? 'grande' : 'padrao'], TEXTO_CAMPO, erro && BORDA_ERRO, className)}
        {...props}
      />
      <MensagemCampo id={ids.ajuda} erro={erro} dica={dica} />
    </div>
  )
}

/** Senha com o botão de mostrar e ocultar. */
export function CampoSenha({ rotulo, erro, dica, grande, id, className, ...props }: PropsCampo) {
  const ids = useIds(id)
  const [visivel, setVisivel] = useState(false)
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ids.campo} className="text-label">{rotulo}</label>
      <span className={cn('flex items-center pr-1 pl-3.5 lg:pr-0.5', BORDA, MOLDURA[grande ? 'grande' : 'padrao'], FOCO_DENTRO, erro && BORDA_ERRO)}>
        <input
          id={ids.campo}
          type={visivel ? 'text' : 'password'}
          {...descricao(ids, erro, dica)}
          className={cn('h-full min-w-0 flex-1 bg-transparent outline-none', TEXTO_CAMPO, className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel(v => !v)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          className="grid size-control shrink-0 place-items-center rounded-md text-ink hover:bg-surface-sunken"
        >
          {visivel ? <EyeOff size={20} strokeWidth={1.7} /> : <Eye size={20} strokeWidth={1.7} />}
        </button>
      </span>
      <MensagemCampo id={ids.ajuda} erro={erro} dica={dica} />
    </div>
  )
}

/**
 * Valor em reais. A pessoa digita como quiser ("1234,5", "1.234,56") e, ao sair do campo,
 * o texto vira "1.234,50". O valor continua texto no formulário; o esquema Zod converte em centavos.
 */
export function CampoDinheiro({ rotulo, erro, dica, grande, id, className, onBlur, ...props }: PropsCampo) {
  const ids = useIds(id)
  const formatar = (e: FocusEvent<HTMLInputElement>) => {
    const centavos = lerValor(e.currentTarget.value)
    if (centavos !== null) e.currentTarget.value = formatarNumero(centavos)
    onBlur?.(e) // o React Hook Form lê o valor já formatado
  }
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ids.campo} className="text-label">{rotulo}</label>
      <span className={cn('flex items-center gap-1.5 px-3.5', BORDA, MOLDURA[grande ? 'grande' : 'padrao'], FOCO_DENTRO, erro && BORDA_ERRO)}>
        <span className="text-ink-muted" aria-hidden>R$</span>
        <input
          id={ids.campo}
          inputMode="decimal"
          autoComplete="off"
          {...descricao(ids, erro, dica)}
          className={cn('h-full min-w-0 flex-1 bg-transparent outline-none', TEXTO_CAMPO, className)}
          onBlur={formatar}
          {...props}
        />
      </span>
      <MensagemCampo id={ids.ajuda} erro={erro} dica={dica} />
    </div>
  )
}

/**
 * Data sempre em dd/mm/aaaa. O <input type="date"> nativo mostra a data no idioma do navegador
 * (num Chrome em inglês, "10/15/2026"), então a pessoa digita num campo de texto com máscara e o
 * botão de calendário abre o seletor nativo. O valor que entra e sai é 'YYYY-MM-DD'.
 * Controlado: use com o <Controller> do React Hook Form.
 */
export function CampoData({ rotulo, erro, dica, grande, value, onChange, onBlur, name, min, max, ref }: {
  rotulo: string
  erro?: string
  dica?: string
  grande?: boolean
  value: string
  onChange: (valor: string) => void
  onBlur?: () => void
  name?: string
  min?: string
  max?: string
  ref?: Ref<HTMLInputElement>
}) {
  const ids = useIds()
  const seletor = useRef<HTMLInputElement>(null)
  const [texto, setTexto] = useState(value ? formatarData(value) : '')
  // Valor mudou por fora (calendário, reset do formulário): atualiza o texto durante a renderização.
  const [valorAnterior, setValorAnterior] = useState(value)
  if (value !== valorAnterior) {
    setValorAnterior(value)
    if (value && value !== lerData(texto)) setTexto(formatarData(value))
  }

  const abrirCalendario = () => {
    try {
      seletor.current?.showPicker()
    } catch {
      // Navegador sem showPicker: a pessoa digita a data.
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ids.campo} className="text-label">{rotulo}</label>
      <span className={cn('relative flex items-center pr-0.5 pl-3 lg:pl-3.5', BORDA, MOLDURA[grande ? 'grande' : 'padrao'], FOCO_DENTRO, erro && BORDA_ERRO)}>
        <input
          ref={ref}
          id={ids.campo}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          placeholder="dd/mm/aaaa"
          maxLength={10}
          value={texto}
          onChange={e => {
            const novo = mascararData(e.target.value)
            setTexto(novo)
            onChange(lerData(novo) ?? '') // incompleta ou inexistente: o esquema mostra o erro
          }}
          onBlur={onBlur}
          {...descricao(ids, erro, dica)}
          className={cn('h-full min-w-0 flex-1 bg-transparent outline-none', TEXTO_CAMPO)}
        />
        <button
          type="button"
          onClick={abrirCalendario}
          aria-label="Abrir calendário"
          className="grid size-control shrink-0 place-items-center rounded-md text-ink hover:bg-surface-sunken"
        >
          <CalendarDays size={18} strokeWidth={1.7} />
        </button>
        {/* Só para abrir o seletor nativo; invisível e fora da ordem de tabulação. */}
        <input
          ref={seletor}
          type="date"
          tabIndex={-1}
          aria-hidden
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          className="pointer-events-none absolute bottom-0 left-0 size-px opacity-0"
        />
      </span>
      <MensagemCampo id={ids.ajuda} erro={erro} dica={dica} />
    </div>
  )
}

/** Lista de opções (select nativo: no celular abre o seletor do sistema). */
export function CampoSelecao({ rotulo, erro, dica, id, className, children, ...props }: Omit<ComponentProps<'select'>, 'children'> & {
  rotulo: string
  erro?: string
  dica?: string
  children: ReactNode
}) {
  const ids = useIds(id)
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ids.campo} className="text-label">{rotulo}</label>
      <select
        id={ids.campo}
        {...descricao(ids, erro, dica)}
        className={cn('w-full min-w-0 px-2.5', BORDA, MOLDURA.padrao, TEXTO_CAMPO, erro && BORDA_ERRO, className)}
        {...props}
      >
        {children}
      </select>
      <MensagemCampo id={ids.ajuda} erro={erro} dica={dica} />
    </div>
  )
}

export function MensagemCampo({ id, erro, dica }: { id?: string; erro?: string; dica?: string }) {
  if (erro) {
    return (
      <span id={id} className="flex items-center gap-1.5 text-caption font-semibold text-ink">
        <CircleAlert size={14} strokeWidth={2} className="shrink-0" aria-hidden /> {erro}
      </span>
    )
  }
  if (dica) return <span id={id} className="text-caption text-ink-muted">{dica}</span>
  return null
}

/** Erro do formulário inteiro (vindo do servidor). Sem cor: cor é só para dinheiro e faixas. */
export function AvisoFormulario({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p role="alert" className="flex items-start gap-2 rounded-md bg-surface-sunken px-3.5 py-3 text-label">
      <CircleAlert size={18} strokeWidth={2} className="mt-px shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/** Confirmação discreta depois de salvar ("Ajustes salvos."). */
export function AvisoSalvo({ children }: { children?: ReactNode }) {
  return (
    <p role="status" className="flex min-h-5 items-center justify-center gap-1.5 text-label text-ink-muted">
      {children && <Check size={16} strokeWidth={2} aria-hidden />}
      {children}
    </p>
  )
}

export function BotaoPrincipal({ pendente, children, className, type = 'submit', ...props }: ComponentProps<'button'> & { pendente?: boolean }) {
  return (
    <button
      type={type}
      disabled={pendente}
      aria-busy={pendente || undefined}
      className={cn(
        'flex h-control-lg w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary',
        'hover:bg-primary/85 disabled:opacity-70',
        className,
      )}
      {...props}
    >
      {pendente && <LoaderCircle size={18} strokeWidth={2.2} className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

/** Botão secundário: contorno preto, 40px de altura (DESIGN.md). */
export function BotaoSecundario({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={cn(
        'flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-primary bg-surface px-3.5 text-label hover:bg-surface-sunken disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}

type Opcao<T extends string> = { valor: T; rotulo: string }

/** Segmentado (pílulas lado a lado), como o seletor Entrada / Saída / Diário. */
export function Segmentado<T extends string>({ rotulo, opcoes, valor, onChange }: {
  rotulo: string
  opcoes: Opcao<T>[]
  valor: T
  onChange: (v: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="flex gap-1 rounded-full bg-surface-sunken p-1">
      {opcoes.map(o => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          onClick={() => onChange(o.valor)}
          className={cn('h-control flex-1 rounded-full px-2 font-medium text-ink-muted', valor === o.valor && 'bg-primary font-semibold text-on-primary')}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  )
}
