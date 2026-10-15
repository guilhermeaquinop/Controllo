# Controllo

O saldo de cada dia, hoje e nos meses que vêm. App de controle financeiro pessoal, celular e web.

- Especificação: [docs/01-especificacao-funcional.md](docs/01-especificacao-funcional.md)
- Guia de estilo: [design/DESIGN.md](design/DESIGN.md) e mockups em [design/mockups/](design/mockups/)
- Instruções para o Claude Code: [CLAUDE.md](CLAUDE.md)

Stack: Next.js 16 (App Router) + TypeScript, Supabase (Postgres, Auth, RLS), Tailwind CSS v4 + shadcn/ui, Vitest. Deploy na Vercel.

## Rodar no computador

Precisa de Node 20+ e Docker (para o Supabase local).

```bash
npm install
npm run db:start            # sobe Postgres, Auth, Studio e o Mailpit (caixa de e-mails de teste)
cp .env.example .env.local  # preencha com a URL e a chave publicável mostradas pelo comando acima
npm run dev                 # http://localhost:3000
```

Os e-mails de confirmação e de nova senha não saem para a internet: abra http://127.0.0.1:54324 (Mailpit) para vê-los. O banco pode ser consultado no Studio, em http://127.0.0.1:54323.

O Docker não fica com o Supabase ligado o tempo todo: os contêineres só sobem com `npm run db:start` e ficam no ar até `npm run db:stop` (não voltam sozinhos quando o Docker abre).

| Comando | Para quê |
| --- | --- |
| `npm run test` | Testes (Vitest) |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm run db:start` / `npm run db:stop` | Sobe e desliga o Supabase local. Os contêineres não reiniciam sozinhos |
| `npx supabase migration up` | Aplica migrations novas sem apagar os dados |
| `npm run db:reset` | Recria o banco local do zero a partir das migrations (apaga os dados) |
| `npm run db:types` | Regera `lib/supabase/database.types.ts` |

## Publicar (Supabase + Vercel)

1. **Supabase:** crie um projeto e aplique as migrations (`npx supabase link` e `npx supabase db push`).
2. **Authentication > URL Configuration:** Site URL = endereço do app (ex.: `https://controllo.app`); em Redirect URLs, inclua `https://controllo.app/**`.
3. **Authentication > Sign In / Providers > Email:** deixe "Confirm email" ligado e a senha mínima em 8.
4. **Authentication > Email Templates:** copie o conteúdo de [supabase/templates/confirmacao.html](supabase/templates/confirmacao.html) em "Confirm signup" e de [supabase/templates/recuperacao.html](supabase/templates/recuperacao.html) em "Reset password" (assuntos em [supabase/config.toml](supabase/config.toml)). Esses modelos mandam o link com `token_hash`, que funciona mesmo se a pessoa abrir o e-mail em outro aparelho.
5. **SMTP:** o envio do Supabase gratuito tem limite baixo de e-mails por hora; para uso real, configure um SMTP próprio em Project Settings > Auth.
6. **Vercel:** importe o repositório e defina `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_SITE_URL`.
