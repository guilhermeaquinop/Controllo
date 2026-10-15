// Logo do Controllo em SVG em linha. Herda a cor do texto (currentColor),
// então funciona em fundo claro e escuro. Fonte: public/brand/*.svg.
// As barras do "ll" usam --logo-recorte (padrão: --surface). Em fundo escuro com logo
// branco, defina [--logo-recorte:var(--primary)] no elemento pai.
type Props = { className?: string }

const LETRAS = (
  <g fill="none" stroke="currentColor" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round">
    <path d="M46.62 59.88A23.5 23.5 0 1 0 46.62 93.12" />
    <circle cx="100" cy="76.5" r="23.5" />
    <path d="M146.5 100V76.5A23.5 23.5 0 0 1 193.5 76.5V100" />
    <path d="M222 24V100M211 53H236" />
    <path d="M260.5 100V76.5A23.5 23.5 0 0 1 284 53" />
    <circle cx="330" cy="76.5" r="23.5" />
    <path d="M378.5 34V100" />
    <path d="M404.5 14V100" />
    <circle cx="453" cy="76.5" r="23.5" />
  </g>
)

/** A marca: quadrado com o "ll" em duas barras. Use como ícone. */
export function Marca({ className }: Props) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="Controllo">
      <rect width="96" height="96" rx="26" fill="currentColor" />
      <g fill="none" stroke="var(--logo-recorte, var(--surface))" strokeWidth={13} strokeLinecap="round">
        <path d="M38 46V70" />
        <path d="M58 26V70" />
      </g>
    </svg>
  )
}

/** Marca + logotipo. Login: className="h-[34px] w-auto"; menu web: "h-[27px] w-auto". */
export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 612 112" className={className} role="img" aria-label="Controllo">
      <rect x="0" y="10.5" width="96" height="96" rx="26" fill="currentColor" />
      <g fill="none" stroke="var(--logo-recorte, var(--surface))" strokeWidth={13} strokeLinecap="round">
        <path d="M38 56.5V80.5" />
        <path d="M58 36.5V80.5" />
      </g>
      <g transform="translate(128 0)">{LETRAS}</g>
    </svg>
  )
}

/** Só o logotipo "controllo". */
export function Logotipo({ className }: Props) {
  return (
    <svg viewBox="0 0 484 112" className={className} role="img" aria-label="Controllo">
      {LETRAS}
    </svg>
  )
}
