# Controllo

App de controle financeiro pessoal, celular e web. A pessoa lança Entradas, Saídas e Diário; o app mostra o saldo do fim de cada dia num calendário colorido por faixa, a visão do ano e a previsão dos meses seguintes. Também controla reservas (Economia).

Referências (a fonte da verdade, nesta ordem), todas dentro do repositório:

1. `docs/01-especificacao-funcional.md`: regras, telas, modelo de dados, ordem de implementação.
2. `design/DESIGN.md`: guia de estilo com medidas e classes do Tailwind de cada componente.
3. `design/mockups/celular/imagens/*.png` e `design/mockups/web/imagens/*.png`: como cada tela deve ficar. **Abra a imagem da tela antes de construí-la.** O código de cada mockup (`*.dc.html`, ao lado) traz as medidas exatas.
4. `design/design-system/`: brand book (README.md) e `tokens.json`.

As versões vivas ficam no claude.ai (especificação, design system e mockups), mas só o dono do projeto tem acesso a elas; trabalhe sempre pelas cópias do repositório.

O dono do projeto conhece bem PHP e Laravel e menos JavaScript/TypeScript. Ao explicar uma decisão, use a comparação com o Laravel quando ajudar (a especificação tem uma tabela de equivalências).

## Stack

- Next.js (App Router) + TypeScript estrito
- Supabase: Postgres, Auth via `@supabase/ssr`, Row Level Security
- Tailwind CSS v4 (configuração no CSS, sem `tailwind.config.ts`) + shadcn/ui; `Drawer` (vaul) para a folha do celular; ícones `lucide-react`
- React Hook Form + Zod; `date-fns` + `@date-fns/tz`; Recharts
- Vercel (deploy e Cron); Vitest

## Comandos

```bash
npm run dev              # servidor local
npm run test             # Vitest
npm run lint && npm run typecheck
npm run db:start         # Supabase local (Docker), sem reinício automático dos contêineres
npm run db:stop          # desliga o Supabase local
npx supabase migration up  # aplica migrations novas sem apagar dados
npm run db:reset         # recria o banco local a partir das migrations (apaga dados)
npm run db:types         # regera lib/supabase/database.types.ts
```

## Estrutura

```
app/
  (auth)/entrar, criar-conta, recuperar-senha, nova-senha
  (app)/mes, ano, economia, resumo, ajustes      # telas logadas
  (app)/primeiro-acesso
  auth/confirmar/route.ts                         # retorno dos links de e-mail (token_hash ou code)
  api/cron/recorrencias/route.ts                  # Vercel Cron, protegido por CRON_SECRET
components/
  ui/            # shadcn/ui
  acesso/        # campos e formulários das telas de acesso
  calendario/    # célula do dia, chip de saldo, mapa do ano
  lancamento/    # folha/painel do dia, formulário
  layout/        # casca logada, barra de abas (celular), menu lateral (web), barra superior
lib/
  acesso/        # esquemas Zod, Server Actions de login, regras de rota, exigirUsuario()
  calculo/       # funções puras: saldo, faixas, performance, previsão, parcelas, recorrência
  supabase/      # clientes server/browser/proxy, tipos gerados
  formato.ts     # reais, datas pt-BR
supabase/migrations/, supabase/templates/   # migrations e modelos de e-mail em português
proxy.ts         # o "middleware" do Next 16: renova a sessão e redireciona
```

### Next.js 16

- Esta versão muda APIs em relação ao que costuma aparecer em exemplos: leia `AGENTS.md` e o guia em `node_modules/next/dist/docs/` antes de usar uma API nova.
- `middleware.ts` agora se chama `proxy.ts`. `params` e `searchParams` são Promises (`await`).
- `cacheComponents` está desligado de propósito: toda tela é por usuário, renderização dinâmica clássica.
- Usuário logado no servidor: `exigirUsuario()` de `lib/acesso/usuario.ts` (valida o token com `getClaims()`). Nunca confie em `getSession()` no servidor.
- `cn` (em `lib/utils.ts`) conhece a escala de texto do design system. Ao criar um token `--text-*` novo, registre-o lá também.

## Regras do domínio (não negociáveis)

- **Dinheiro em centavos inteiros** (`bigint` no banco, `number` inteiro no TS). Nunca `float`. Formatar em reais só na tela, com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- **Datas são `date` (sem hora)** e "hoje" é calculado em `America/Sao_Paulo`. Nunca use o fuso do servidor.
- **O saldo é calculado, nunca guardado.** Saldo do dia D = saldo inicial + Σ lançamentos de `saldo_inicial_data` até D (Entrada soma; Saída e Diário subtraem). Use `saldo_antes_de(data)` no banco para o ponto de partida e calcule o período em `lib/calculo/`.
- **Faixas:** negativo < 0 ≤ baixa < faixa_1 ≤ média < faixa_2 ≤ boa < faixa_3 ≤ alta.
- **Performance** = Entradas − (Saídas + Diário) do mês. Aporte em reserva conta como Saída.
- **Previsão:** dias depois de hoje. Com `previsao_conta_diario`, cada dia futuro sem Diário lançado desconta a média do Diário dos últimos 90 dias.
- **Parcelas:** total ÷ N arredondado para baixo; a diferença vai na última. Mesmo `grupo_id`, descrição com "k/N". Dia que não existe no mês → último dia do mês.
- **Repete todo mês:** regra em `recorrencias`, lançamentos materializados até 12 meses à frente; o cron do dia 1 estende. Cada lançamento gerado é independente (`editado_manual` ao alterar).
- Toda regra de `lib/calculo/` tem teste no Vitest antes de ir para a tela. O mês de exemplo dos mockups (outubro: saldo inicial R$ 635,08, saldo de R$ 3.627,09 no dia 4, performance + R$ 81,89) serve de caso de teste.

## Segurança

- RLS ligado em todas as tabelas; nunca desligue para "facilitar".
- `SUPABASE_SERVICE_ROLE_KEY` só no Route Handler do cron. Nunca em componente, nunca com prefixo `NEXT_PUBLIC_`.
- Toda escrita passa por Server Action com esquema Zod, mesmo que o formulário já valide.

## Interface

- **Siga as imagens dos mockups e o `design/DESIGN.md`.** Preto, branco e cinza; cor só para dinheiro (verde entrada, vermelho saída, sempre com + ou −) e para as faixas do saldo.
- Tokens já prontos em `app/globals.css` (Tailwind v4 + nomes do shadcn). Use só as classes que eles geram (`bg-surface`, `text-ink-muted`, `bg-zone-ok`, `text-money-in`, `text-chip`, `h-control`...). **Nunca escreva uma cor em hex num componente.**
- Montserrat via `next/font/google` (já em `app/layout.tsx`), números com `tabular-nums` (já no `body`).
- Componentes de referência prontos, para usar e completar: `components/marca/Logo.tsx`, `components/dinheiro/Dinheiro.tsx` (com "Ocultar valores"), `components/calendario/ChipSaldo.tsx` e `CelulaDia.tsx`, `components/layout/Navegacao.tsx` (barra de abas e menu lateral), `components/lancamento/ItemLancamento.tsx` e `SeletorTipo.tsx`. Eles usam `cn` de `lib/utils.ts`, que o `npx shadcn init` cria.
- Logos em `public/brand/`, ícone em `app/icon.svg`, manifesto PWA em `public/manifest.webmanifest`.
- Alvos de toque ≥ 44px; foco visível (contorno 2px em `--primary`).
- Textos em português do Brasil, frases curtas, verbo no começo dos botões. Sem exclamação nem emoji.

## Jeito de trabalhar

- Siga a ordem de implementação da especificação, uma etapa por vez, e pare ao fim de cada uma para revisão.
- Mudança no banco = nova migration em `supabase/migrations/` (nunca editar uma já aplicada) e tipos regenerados.
- Antes de concluir: `npm run lint`, `npm run typecheck` e `npm run test` passando.
