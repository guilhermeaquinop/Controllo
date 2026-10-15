'use client'
// Campos e botões das telas de acesso (Entrar, Criar conta, Recuperar senha, Nova senha).
// Medidas do mockup: campo de 52px no celular e 48px na web, cantos de 12px.
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { CircleAlert, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// 16px no celular: abaixo disso o Safari do iPhone dá zoom ao tocar no campo.
const CLASSE_CAMPO =
  'h-control-lg w-full rounded-[12px] border border-border-control bg-surface px-3.5 text-base text-ink placeholder:text-ink-muted lg:h-12 lg:text-body aria-invalid:border-primary aria-invalid:ring-1 aria-invalid:ring-primary'

type PropsCampo = ComponentProps<'input'> & { rotulo: string; erro?: string; dica?: string }

export function CampoTexto({ rotulo, erro, dica, id, className, ...props }: PropsCampo) {
  const gerado = useId()
  const idCampo = id ?? gerado
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-label">{rotulo}</label>
      <input
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro || dica ? `${idCampo}-ajuda` : undefined}
        className={cn(CLASSE_CAMPO, className)}
        {...props}
      />
      <Ajuda id={`${idCampo}-ajuda`} erro={erro} dica={dica} />
    </div>
  )
}

/** Senha com o botão de mostrar e ocultar. */
export function CampoSenha({ rotulo, erro, dica, id, className, ...props }: PropsCampo) {
  const gerado = useId()
  const idCampo = id ?? gerado
  const [visivel, setVisivel] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-label">{rotulo}</label>
      <span
        className={cn(
          'flex h-control-lg items-center rounded-[12px] border border-border-control bg-surface pr-1 pl-3.5 lg:h-12 lg:pr-0.5',
          'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary',
          erro && 'border-primary ring-1 ring-primary',
        )}
      >
        <input
          id={idCampo}
          type={visivel ? 'text' : 'password'}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || dica ? `${idCampo}-ajuda` : undefined}
          className={cn('h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted lg:text-body', className)}
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
      <Ajuda id={`${idCampo}-ajuda`} erro={erro} dica={dica} />
    </div>
  )
}

function Ajuda({ id, erro, dica }: { id: string; erro?: string; dica?: string }) {
  if (erro) {
    return (
      <span id={id} className="flex items-center gap-1.5 text-caption font-semibold text-ink">
        <CircleAlert size={14} strokeWidth={2} aria-hidden /> {erro}
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

export function BotaoPrincipal({ pendente, children, className, ...props }: ComponentProps<'button'> & { pendente?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pendente}
      aria-busy={pendente || undefined}
      className={cn(
        'flex h-control-lg w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary lg:h-12',
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
