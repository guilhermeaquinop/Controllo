# Controllo — Especificação funcional v1

15/10/2026 · Guilherme
Versão viva: https://claude.ai/code/artifact/b4a14865-53d5-40c7-9cf6-bd325aeab317 (esta cópia é de 15/10/2026)

## Visão geral

O Controllo é um app de controle financeiro pessoal, para celular e web, que mostra o saldo da conta no fim de cada dia e a previsão dos meses seguintes. A pessoa lança o que entrou, o que saiu e o gasto do dia a dia; o app pinta cada dia do calendário com a faixa do saldo.

A lógica vem da planilha de saldo diário (estilo Planilha do Breno) que o usuário já usa:

- **Três tipos de lançamento:** Entrada, Saída (contas e compromissos) e Diário (gasto do dia a dia).
- **Saldo corrido:** o saldo de cada dia é o do dia anterior mais as entradas, menos as saídas e o diário. Passa de um mês para o outro.
- **Faixas de cor:** o saldo de cada dia ganha uma cor conforme o valor (negativo, baixo, médio, bom, alto).
- **Previsibilidade:** lançamentos futuros, parcelas e recorrências formam o saldo previsto dos próximos dias, meses e anos.
- **Economia:** reservas (emergência, investimentos, viagem) com saldo próprio, alimentadas por aportes e resgates.

O Controllo é um produto separado do Fatturo, com a mesma stack e o mesmo jeito de construir. A identidade visual está no design system Controllo (`design/`) e as telas, nos mockups (`design/mockups/`). Na v1 é de uso próprio, sem cobrança.

## Escopo da v1

A v1 cobre lançar, ver o saldo dia a dia e prever os próximos meses, numa única conta por usuário. Importação de extrato, várias contas e cartão de crédito ficam para depois.

| Entra na v1 | Fica para depois |
| --- | --- |
| Cadastro, login e recuperação de senha | Login com Google ou Apple |
| Saldo inicial e faixas de cor configuráveis | Várias contas (banco, carteira, conta da empresa) |
| Lançamentos de Entrada, Saída e Diário, com categoria e descrição | Importar extrato (OFX, CSV) ou ler notificações do banco |
| Lançamentos em datas futuras, parcelas e "Repete todo mês" | Controle de cartão de crédito por fatura e limite (hoje a fatura é uma Saída) |
| Telas Mês, Ano, Economia, Resumo e Ajustes, no celular e na web | Orçamento ou limite por categoria |
| Previsão do saldo, com a opção de contar a média do diário | Metas com prazo e aporte sugerido |
| Reservas com aportes, resgates e meta opcional | Compartilhar a conta com outra pessoa |
| Ocultar valores (o olho no topo) | Notificações e lembretes |
| Exportar os lançamentos em CSV e excluir a conta | App nativo nas lojas (a v1 é web responsiva, instalável como PWA) |

## Regras de cálculo

Todo valor é guardado em centavos (inteiro) e todo dia é contado no fuso America/Sao_Paulo. As regras ficam em funções puras em `lib/calculo/`, testadas com Vitest, e são as mesmas no celular e na web.

| Conta | Regra |
| --- | --- |
| Saldo do dia D | Saldo inicial + soma de todos os lançamentos da data do saldo inicial até D, onde Entrada soma e Saída e Diário subtraem |
| Dias antes do saldo inicial | Sem saldo: mostram "—" |
| Faixa do saldo | Negativo se < 0; baixa se < limite 1; média se < limite 2; boa se < limite 3; alta a partir do limite 3. Padrão: 1.000, 2.000 e 4.000 |
| Entradas, Saídas, Diário do mês | Soma dos lançamentos de cada tipo com data no mês |
| Saída total do mês | Saídas + Diário |
| Performance do mês | Entradas − Saída total |
| Média do diário | Soma do Diário nos últimos 90 dias até ontem ÷ 90 |

### Previsão

- Qualquer dia depois de hoje é previsão. O cálculo é o mesmo do saldo, usando os lançamentos já marcados para o futuro.
- Com "Contar o gasto diário" ligado, cada dia futuro desconta também a média do diário. Dias futuros que já têm lançamento de Diário não recebem a média.
- A preferência fica salva por usuário e vale para Mês, Ano e Resumo.
- Dias previstos aparecem com o anel branco no calendário e a palavra "previsto" nos totais.

### Parcelas

1. O valor digitado é o total da compra.
2. Gera N lançamentos, um por mês, no mesmo dia (ou no último dia do mês, se ele não existir).
3. Cada parcela vale o total ÷ N, arredondado para baixo em centavos; a diferença vai para a última.
4. A descrição recebe o sufixo "1/N", "2/N" e assim por diante. Todas compartilham um `grupo_id`.
5. Editar ou excluir oferece: só esta parcela, esta e as seguintes, ou todas.

### Repete todo mês

- Cria uma regra de recorrência e materializa um lançamento por mês, do mês escolhido até 12 meses à frente.
- Um job mensal (Vercel Cron, dia 1) estende cada regra ativa para manter sempre 12 meses à frente.
- Cada lançamento gerado é independente: pode ser movido para outro dia, ter o valor alterado ou ser apagado sem afetar os outros.
- Encerrar a recorrência apaga os lançamentos futuros ainda não editados e mantém os passados.

### Reservas

- Aporte = Saída da conta ligada a uma reserva: o saldo da conta cai e o da reserva sobe.
- Resgate = Entrada na conta ligada a uma reserva: o saldo da conta sobe e o da reserva cai.
- Saldo da reserva = saldo inicial da reserva + aportes − resgates.
- Na Performance, o aporte conta como Saída (como na planilha). O Resumo mostra "Guardado no mês" (aportes − resgates) à parte, e o gráfico de categorias mostra as reservas em cinza.

## Telas

São 10 telas, iguais em conteúdo no celular e na web; muda só a navegação. No celular, barra de abas com Mês, Ano, Lançar (centro), Economia e Resumo, e Ajustes na engrenagem do topo. Na web, menu lateral com Lançar no topo, as mesmas quatro telas, e Ajustes e Sair no rodapé. O layout segue os mockups e o design system Controllo.

### Acesso

**Entrar.** E-mail, senha com botão de mostrar, "Esqueci minha senha", "Manter conectado" (web) e link para criar conta.

**Criar conta.** Nome, e-mail e senha. Confirmação por e-mail antes do primeiro acesso.

**Recuperar senha.** Pede o e-mail e envia o link de nova senha.

**Primeiro acesso.** Um passo só: saldo atual da conta e a data. Cria as categorias padrão e as faixas 1.000, 2.000 e 4.000. Dá para pular e ajustar depois.

### Uso diário

**Mês.** Navegação de mês com setas, sem limite para frente ou para trás. Calendário com o saldo do fim de cada dia no chip da faixa; na web, cada dia mostra também entrada, saída e diário. Hoje com o número em círculo preto, dias previstos com anel branco. Abaixo, Dados gerais: Performance, Entradas, Saídas, Diário, Saída total e Guardado no mês.

**Lançar (folha do dia).** Abre ao tocar num dia ou no botão Lançar (que abre hoje). No celular é uma folha que sobe sobre o mês; na web, o painel à direita do calendário. Mostra o saldo do dia e o resumo Entrou / Saiu / Diário, o formulário (tipo, valor, categoria, descrição, parcelas, repete todo mês) e a lista do dia com valores em verde ou vermelho. Tocar num item abre a edição.

**Ano.** 12 meses, um quadrado por dia na cor da faixa, com a performance de cada mês. Totais do ano, dias abaixo do limite 1, saldo previsto em 31/12 e o interruptor "Contar o gasto diário". Tocar num mês abre esse mês.

**Economia.** Total guardado com barras mês a mês, quanto entrou e saiu das reservas no mês, um cartão por reserva (saldo, meta e progresso) e a lista de aportes e resgates. Tocar numa reserva filtra a lista. Botão "Nova reserva".

**Resumo.** Performance do mês com a conta explicada, gráfico do saldo dia a dia com a linha do limite 1 e "Para onde foi o dinheiro" por categoria.

### Conta

**Ajustes.** Saldo inicial e data, limites das faixas, categorias (Saídas e diário, Entradas) e reservas, perfil e senha, exportar CSV, sair e excluir conta.

O olho do topo oculta todo valor em reais (vira `R$ •••••`) e mantém cores, datas e percentuais. A escolha fica salva no aparelho.

## Modelo de dados

Seis tabelas no Postgres do Supabase, todas com `usuario_id` e protegidas por RLS: cada pessoa só lê e grava as próprias linhas. O saldo não é guardado: é calculado a partir dos lançamentos. O SQL completo está em `supabase/migrations/0001_inicial.sql`.

| Tabela | Campos principais | Observações |
| --- | --- | --- |
| `perfis` | `id` (o mesmo de auth.users), `nome`, `criado_em` | E-mail e senha ficam no Supabase Auth |
| `configuracoes` | `usuario_id` (chave), `saldo_inicial_centavos`, `saldo_inicial_data`, `faixa_1`, `faixa_2`, `faixa_3` (centavos), `previsao_conta_diario` (bool) | Uma linha por usuário, criada no primeiro acesso. Check: faixa_1 < faixa_2 < faixa_3 |
| `categorias` | `id`, `usuario_id`, `nome`, `grupo` (`saida` ou `entrada`), `ordem`, `arquivada` | `saida` serve para Saída e Diário. Nome único por usuário e grupo. Arquivar em vez de apagar quando houver lançamentos |
| `reservas` | `id`, `usuario_id`, `nome`, `meta_centavos` (opcional), `saldo_inicial_centavos`, `ordem`, `arquivada` | Saldo da reserva é calculado |
| `lancamentos` | `id`, `usuario_id`, `data`, `tipo` (`entrada`, `saida`, `diario`), `valor_centavos` (> 0), `categoria_id`, `reserva_id`, `descricao`, `grupo_id`, `parcela_numero`, `parcela_total`, `recorrencia_id`, `editado_manual`, `criado_em`, `atualizado_em` | Exatamente um entre `categoria_id` e `reserva_id`. `reserva_id` só com tipo `entrada` (resgate) ou `saida` (aporte). Índice em (`usuario_id`, `data`) |
| `recorrencias` | `id`, `usuario_id`, `tipo`, `valor_centavos`, `categoria_id`, `reserva_id`, `descricao`, `dia_do_mes`, `inicio`, `fim` (opcional), `gerado_ate` | A regra do "Repete todo mês". O job mensal lê `gerado_ate` e cria o que falta |

Categorias padrão criadas no primeiro acesso: Moradia, Fatura do cartão, Contas e boletos, Mercado, Alimentação, Transporte, Saúde, Lazer, Assinaturas e Outros (saída); Salário / pró-labore, Renda extra e Outras entradas (entrada). Reservas começam vazias.

## Segurança e privacidade

Dados financeiros pessoais são sensíveis: o isolamento entre usuários fica no banco, não só no código.

- **Senhas:** gerenciadas pelo Supabase Auth (hash, confirmação de e-mail, recuperação e limite de tentativas).
- **Isolamento:** RLS ligado em todas as tabelas, com políticas `usuario_id = auth.uid()` para ler, criar, alterar e apagar. Chaves estrangeiras de categoria, reserva e recorrência validam que o item é do mesmo usuário.
- **Chave de serviço:** a `service_role` só é usada no job mensal de recorrências, num Route Handler protegido pelo `CRON_SECRET` da Vercel. Nunca vai para o navegador.
- **Validação:** toda escrita passa por um esquema Zod no servidor (Server Action), mesmo com o formulário já validado no navegador.
- **Ocultar valores:** só visual, guardado no aparelho. Não substitui o bloqueio de tela.
- **Seus dados:** exportar todos os lançamentos em CSV e excluir a conta, apagando todas as linhas do usuário e o login.

## Stack

A mesma do Fatturo: Next.js com TypeScript, Supabase e deploy na Vercel. Um projeto Supabase próprio e um repositório próprio; nada compartilhado com o Fatturo.

| Camada | Escolha |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Banco e autenticação | Supabase: Postgres, Supabase Auth via `@supabase/ssr` e Row Level Security |
| Interface | Tailwind CSS v4 + shadcn/ui, Montserrat e os tokens do design system Controllo (`app/globals.css`) |
| Folha que sobe (celular) | `Drawer` do shadcn/ui (vaul) |
| Gráficos | Recharts para o saldo do mês e as barras da Economia; calendário e mapa do ano em CSS grid |
| Formulários e validação | React Hook Form + Zod |
| Datas | `date-fns` + `@date-fns/tz` (America/Sao_Paulo) |
| Tarefas agendadas | Vercel Cron (extensão mensal das recorrências) |
| Instalável no celular | PWA: `manifest.webmanifest` com o ícone da marca |
| Testes | Vitest, com foco em `lib/calculo/` (saldo, faixas, previsão, parcelas) |

Três decisões que simplificam o código:

1. **Centavos inteiros em todo lugar.** Nada de `float` para dinheiro; a formatação em reais só acontece na tela.
2. **O saldo é calculado, nunca guardado.** A tela busca os lançamentos do período mais a soma de tudo antes dele (uma consulta agregada) e o resto é TypeScript puro.
3. **Autenticação pelo Supabase Auth.** Hash de senha, confirmação de e-mail, recuperação e limite de tentativas são configurados no Supabase, não implementados.

### Equivalência para quem vem do Laravel

| No Laravel | Neste projeto |
| --- | --- |
| `routes/web.php` | Pastas em `app/`: cada pasta com `page.tsx` é uma rota |
| Controller | Server Action (formulários) ou Route Handler (`route.ts`, para APIs e o cron) |
| Blade | Componentes React (`.tsx`) |
| Eloquent | Cliente `supabase-js` com tipos gerados do banco |
| Migrations | Migrations do Supabase CLI (`supabase/migrations/*.sql`) |
| Seeders | Função SQL `criar_dados_iniciais()` chamada no primeiro acesso |
| Breeze / Fortify | Supabase Auth |
| Policies e Gates | Políticas de RLS no Postgres |
| Middleware | `middleware.ts` (sessão e redirecionamento de rotas protegidas) |
| Form Request | Esquemas Zod |
| Scheduler (`schedule:run`) | Vercel Cron chamando um Route Handler |
| `.env` | `.env.local` e variáveis de ambiente da Vercel |
| PHPUnit / Pest | Vitest |

## Ordem de implementação

Cada etapa termina com algo usável no celular e na web; a etapa 3 já substitui a planilha no dia a dia.

1. **Base:** projeto Next.js, Supabase, tokens do design system no Tailwind, layout com barra de abas (celular) e menu lateral (web), autenticação completa (cadastro, confirmação, login, recuperação).
2. **Primeiro acesso e Ajustes:** saldo inicial, faixas e categorias padrão; tela de Ajustes com categorias.
3. **Mês e lançamentos:** `lib/calculo/` com testes, calendário com saldo e faixas, folha do dia (celular) e painel do dia (web), criar, editar e excluir lançamento, Dados gerais.
4. **Resumo e ocultar valores:** gráfico do saldo, categorias e o olho do topo.
5. **Ano e previsão:** mapa do ano, dias previstos, média do diário e o interruptor.
6. **Parcelas e recorrência:** geração das parcelas, regra "Repete todo mês", edição em grupo e o cron mensal.
7. **Economia:** reservas, aportes e resgates no formulário, tela Economia e reservas em Ajustes.
8. **Conta e PWA:** exportar CSV, excluir conta, perfil e senha, manifesto e ícone para instalar no celular.

## Questões em aberto

- [ ] Aporte em reserva deve contar como Saída na Performance (como na planilha, adotado aqui) ou ficar de fora?
- [ ] A média do diário usa os últimos 90 dias (adotado aqui) ou o mês anterior?
- [ ] Horizonte do "Repete todo mês": 12 meses à frente (adotado aqui) basta para a visão do ano seguinte?
- [ ] Domínio: verificar controllo.com.br e controllo.app, e o registro do nome no INPI.
- [x] Nome definido: Controllo
- [x] Stack definida: Next.js, Supabase e Vercel
