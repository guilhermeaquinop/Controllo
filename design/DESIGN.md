# Controllo — guia de estilo para implementar

Este arquivo traduz o design system e os mockups em medidas e classes do Tailwind v4. Os tokens estão em `app/globals.css`; os componentes de referência, em `components/`. Na dúvida, o que vale é a imagem do mockup em `design/mockups/*/imagens/`.

## Princípios

1. **Preto, branco e cinza.** Cor só em dois lugares: dinheiro (`money-in` verde, `money-out` vermelho, sempre com + ou −) e faixas do saldo (`zone-*`). Se aparecer cor em outro lugar, está errado.
2. **Uma família tipográfica:** Montserrat 400/500/600/700, números sempre `tabular-nums` (já está no `body`).
3. **Sem sombras**, exceto o botão Lançar central (anel branco) e a folha sobre o `scrim`.
4. **Toque mínimo de 44px** (`size-control`, `h-control`).
5. **Mobile first.** O celular é a referência; a web reorganiza o mesmo conteúdo a partir de `lg` (1024px).

## Tokens rápidos

| Uso | Classe |
| --- | --- |
| Fundo da página | `bg-surface-muted` |
| Cartão | `bg-surface border border-border rounded-lg p-5` |
| Texto secundário | `text-ink-muted` |
| Divisória em lista | `border-b border-divider` (última sem) |
| Campo | `h-12 rounded-md border border-border-control bg-surface px-3.5` |
| Botão principal | `h-control-lg rounded-full bg-primary text-on-primary font-semibold` |
| Botão secundário | `h-10 rounded-full border border-primary bg-surface px-3.5 text-label` |
| Botão de ícone | `size-control rounded-md grid place-items-center hover:bg-surface-sunken` |
| Selo "Dados de exemplo" | `rounded-full bg-surface-sunken px-2 py-0.5 text-caption font-semibold` |
| Entrada (valor) | `text-money-in font-bold` + "+ " |
| Saída / Diário (valor) | `text-money-out font-bold` + "− " (sinal de menos U+2212) |

## Escala de texto

| Classe | Tamanho / peso | Onde |
| --- | --- | --- |
| `text-display` | 40 / 700, −0,02em | Performance no Resumo, total guardado (34px no cartão Dados gerais do celular) |
| `text-title` | 26 / 700 | Título de página na web, "4 de outubro" na folha (22px no celular) |
| `text-heading` | 18 / 700 | Nome da tela na barra superior, mês no calendário |
| `text-section` | 16 / 600 | Título de cartão |
| `text-body` | 14 / 400 | Texto corrido |
| `text-label` | 13 / 600 | Rótulo de campo e de métrica |
| `text-caption` | 12 / 400 | Metadados, legendas, abas |
| `text-chip` | 10 / 700 | Saldo dentro da célula do calendário (celular) |

## Layout

### Celular (< 1024px)

- **Barra superior:** `h-topbar` (56), `bg-surface border-b border-border`, padding `pl-4 pr-1`. Esquerda: nome da tela em `text-heading`. Direita: olho e engrenagem (`size-control`). Em telas internas (Ajustes), voltar + título centralizado. Fixa no topo com `pt-[env(safe-area-inset-top)]`.
- **Conteúdo:** `px-4 pt-4 pb-6`, cartões em coluna com `gap-4`.
- **Barra de abas:** `h-tabbar` (64) + `pb-[env(safe-area-inset-bottom)]`, `bg-surface border-t border-border`, 5 colunas iguais: Mês, Ano, **Lançar**, Economia, Resumo. Aba: ícone 22 + rótulo `text-caption`; ativa com o ícone dentro de uma pílula `w-14 h-7 rounded-full bg-surface-sunken` e texto `font-semibold text-ink`; inativa `text-ink-muted`.
- **Lançar central:** círculo `size-[52px] rounded-full bg-primary text-on-primary`, subido `-mt-[22px]`, anel `ring-[5px] ring-surface`, ícone + de 24 com traço 2,2; rótulo "Lançar" em `text-caption font-semibold text-ink`.

### Web (≥ 1024px)

- **Menu lateral:** `w-sidebar` (220), `bg-surface border-r border-border`, `p-6 px-4`, coluna com `gap-6`: assinatura do logo (146×27), botão Lançar (`h-control rounded-full bg-primary`), navegação (itens `h-control rounded-md px-3 gap-3`, ativo `bg-surface-sunken font-semibold`), e no rodapé Ajustes e Sair com `border-t border-divider pt-4`.
- **Conteúdo:** `flex-1 min-w-0 px-9 py-7`, `gap-5`. Cabeçalho da tela: setas + título `text-title` + legenda das faixas + olho.
- **Mês na web:** duas colunas — calendário (`flex-[999_1_560px]`) e painel do dia (`flex-[1_1_340px]`), `gap-5`, que quebram em coluna em telas menores. Dados gerais numa faixa abaixo, métricas separadas por `border-l border-divider`.

## Componentes

### Chip de saldo (`ChipSaldo`)

A peça mais característica do app. Fundo pela faixa (`faixaDoSaldo()` em `lib/calculo/faixa.ts`), número em `text-on-zone`, exceto na faixa negativa (`text-on-zone-strong`).

| Faixa | Classe de fundo | Texto |
| --- | --- | --- |
| negativo | `bg-zone-negative` | `text-on-zone-strong` |
| baixa | `bg-zone-low` | `text-on-zone` |
| média | `bg-zone-mid` | `text-on-zone` |
| boa | `bg-zone-ok` | `text-on-zone` |
| alta | `bg-zone-high` | `text-on-zone` |
| sem saldo | `bg-surface-sunken` | `text-ink-muted`, mostra "—" |

- Celular: `rounded-sm px-0.5 py-1 text-chip`, valor arredondado sem centavos (`3.627`).
- Web: `rounded-sm px-1.5 py-0.5 text-caption font-bold text-right`, valor com centavos (`3.627,09`).
- **Previsto** (dia depois de hoje): mesmo fundo + `shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.85)]` (o "anel branco"). Os mockups do mês ainda não mostram o anel; o mapa do ano mostra.

### Célula do dia (`CelulaDia`)

- Celular: botão `h-14 rounded-md p-[5px_3px_4px] flex flex-col justify-between`, número `text-xs font-semibold` num círculo `size-5`; hoje = círculo `bg-primary text-on-primary`. Grade `grid-cols-7 gap-1`. Cabeçalho D S T Q Q S S em `text-[11px] font-semibold text-ink-muted`.
- Web: `min-h-[104px] rounded-md border border-border p-2`, mostra "+ entrada" (`text-money-in`), "− saída" (`text-money-out`) e "diário x" (`text-ink-muted`) em 11px, chip embaixo. Selecionado: `border-2 border-primary`. Grade `gap-1.5`.
- Dias antes do 1º do mês: célula vazia invisível (o mês começa na coluna do dia da semana).

### Mapa do ano

- 12 cartões (`rounded-[12px] border border-border p-2.5`), grade `grid-cols-3 gap-2` no celular e `repeat(auto-fill,minmax(220px,1fr))` na web.
- Cada dia é um quadrado `aspect-square rounded-[3px]` (web 4px) na cor da faixa, grade `grid-cols-7 gap-0.5`; dia sem dado `bg-[#ececec]` (use `bg-surface-sunken`); previsto com o anel branco; hoje com `outline-2 outline-primary outline-offset-1`.
- Mês atual com `border-2 border-primary`. Abaixo, a performance do mês em verde ou vermelho, `text-caption font-bold`, e "previsto" nos meses futuros.

### Folha do dia (celular)

- `Drawer` do shadcn (vaul): `rounded-t-sheet bg-surface`, alça `w-10 h-1 rounded-full bg-[#d4d4d4]` (use `bg-border-control/40`), fundo `bg-scrim`.
- Cabeçalho: dia da semana em `text-label text-ink-muted`, data em 22px bold, X de fechar `size-control`.
- Resumo do dia: `rounded-[14px] bg-surface-muted p-3 grid-cols-4`: Entrou (verde), Saiu (vermelho), Diário (vermelho), Saldo (chip).
- **Segmentado de tipo:** trilho `rounded-full bg-[#f0f0f0] p-1 gap-1` (use `bg-surface-sunken`), opção `h-control flex-1 rounded-full`, selecionada `bg-primary text-on-primary font-semibold`. Ordem: Entrada, Saída, Diário. Diário vem selecionado.
- **Valor:** campo grande `h-16 rounded-[14px] border border-border-control px-4`, "R$" em 18 `text-ink-muted`, número em 28 bold na cor do tipo (verde para Entrada, vermelho para Saída e Diário). `inputMode="decimal"`.
- Categoria (select) e Descrição (opcional) lado a lado, `h-12`.
- Dica do tipo em `text-caption text-ink-muted`.
- Caixa de opções `rounded-[12px] border border-border`: Parcelas (− 1× +, botões redondos 40px com borda) e Repete todo mês (interruptor).
- Botão "Adicionar ao diário / à saída / à entrada": `h-[52px] rounded-full bg-primary`.
- Lista do dia: ícone em círculo `size-8` (`bg-money-in-soft text-money-in` seta para cima; `bg-money-out-soft text-money-out` seta para baixo), título `font-semibold`, metadado "Tipo · Categoria" em `text-caption text-ink-muted`, valor à direita.

### Interruptor

`w-[46px] h-7 rounded-full`, ligado `bg-primary`, desligado `bg-[#c8c8c8]`; bolinha `size-[22px] rounded-full bg-white shadow-sm`, `left-[3px]` ou `left-[21px]`. `role="switch"` + `aria-checked`. Use o `Switch` do shadcn com essas cores.

### Cartão de reserva (Economia)

`rounded-lg border border-border p-4 gap-2.5`, nome bold + saldo 18 bold; barra da meta `h-2 rounded-full bg-surface-sunken` com preenchimento `bg-primary`; "+ entrou" verde e "− saiu" vermelho em `text-caption`. Selecionado (filtro): `border-2 border-primary`. O cartão do total guardado é invertido: `bg-primary text-on-primary`, com barras dos meses em cinza e o mês atual em branco.

### Gráfico do saldo (Resumo)

Recharts `AreaChart`: linha `stroke: var(--primary)` 2,5px, área `var(--surface-sunken)`, linha tracejada do limite 1 em `var(--money-out)` com o rótulo "faixa vermelha: 1.000", ponto de hoje = círculo branco com borda `var(--primary)`. Eixos em `text-caption text-ink-muted`, sem grade pesada.

### Categorias (Resumo)

Barra `h-2 rounded-full bg-surface-sunken`, preenchimento `bg-primary`; aportes em reserva em `bg-[#a3a3a3]` (cinza: saiu da conta mas continua seu). Largura relativa à maior categoria.

## Ícones

`lucide-react` com `strokeWidth={1.7}`, tamanho 22 (barra superior e abas), 20 (menu web), 16–18 em botões. Mapa: Mês = `CalendarDays`, Ano = `Grid3x3`, Economia = `Wallet`, Resumo = `ChartNoAxesColumn`, Ajustes = `Settings`, ocultar = `Eye`/`EyeOff`, Sair = `LogOut`, setas = `ChevronLeft`/`ChevronRight`, entrada = `ArrowUp`, saída = `ArrowDown`, fechar = `X`, adicionar = `Plus`.

## Logo

Arquivos em `public/brand/`. Use `components/marca/Logo.tsx` (SVG em linha, herda a cor). Assinatura no login (186×34) e no menu web (146×27); marca sozinha como ícone do app (`app/icon.svg`). Nunca escreva "controllo" em Montserrat no lugar do logotipo.

## Texto

Português do Brasil, frases curtas, verbo no começo dos botões ("Lançar", "Adicionar ao dia", "Salvar ajustes"). Reais com `Intl.NumberFormat('pt-BR')`. Datas `dd/mm`. Previsão sempre marcada como "previsto". Sem exclamação nem emoji.
