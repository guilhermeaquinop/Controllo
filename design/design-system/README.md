# Controllo

Controllo é um app de controle financeiro do dia a dia, para celular e web. A pessoa lança o que entrou, o que saiu e o gasto diário, e vê o saldo de cada dia num calendário colorido, do mês e do ano, inclusive a previsão dos meses que ainda não chegaram. Nasceu da planilha de saldo diário e mantém a mesma lógica: entradas, saídas, diário, saldo e performance.

O nome vem de "controle", em italiano, na mesma família de Fatturo: uma palavra simples do dia a dia financeiro com a consoante dobrada. Escreve-se sempre **Controllo**, com C maiúsculo no texto; no logotipo, tudo em minúsculas.

## A ideia visual

Tudo é preto, branco e cinza. A cor fica reservada para duas coisas, e só para elas:

1. **Dinheiro que entra e sai.** Verde (`money-in`) para entrada, vermelho (`money-out`) para saída e diário. Sempre junto do sinal + ou −, nunca só pela cor.
2. **A faixa do saldo.** Cinco tons (`zone-negative`, `zone-low`, `zone-mid`, `zone-ok`, `zone-high`) pintam o saldo de cada dia no calendário e no mapa do ano. É a assinatura da marca: um ano inteiro de quadradinhos coloridos.

Se uma tela tem cor em outro lugar, algo está errado.

## Logo

- **Marca:** um quadrado preto de cantos arredondados com dois traços brancos, o "ll" do nome. Um é mais alto que o outro, como duas barras de um gráfico. É o ícone do app e o favicon.
- **Logotipo:** "controllo" em minúsculas, desenhado com traço único de espessura constante e pontas redondas. O "ll" repete as duas barras da marca: a segunda é mais alta.
- **Assinatura:** marca à esquerda, logotipo à direita, separados por um terço da altura da marca.

Regras:

- Sobre fundo claro, marca preta e logotipo preto. Sobre fundo escuro, logotipo branco (`controllo-wordmark-white.svg`) e marca com o quadrado em `surface` escuro ou contornada.
- Área de respiro em volta: metade da altura da marca.
- Tamanho mínimo: marca com 20px; logotipo com 72px de largura.
- Não colorir o logotipo com as cores da faixa, não esticar, não trocar a fonte. O logotipo não é texto em Montserrat: use sempre o arquivo.
- Enquanto um produto não tem o arquivo à mão, o nome em texto é **Controllo** em Montserrat 700.

## Voz

- Português do Brasil, frases curtas, verbo no começo dos botões: "Lançar", "Adicionar ao dia", "Salvar ajustes".
- Valores em reais com separador brasileiro: `R$ 3.627,09`. Datas `dd/mm`.
- O app mostra e prevê; não julga nem dá conselho. Nada de exclamação, emoji ou alarme. Um saldo negativo previsto é informação: "Saldo previsto em 31/12".
- Previsão sempre identificada como previsão: a palavra "previsto" e, no calendário, o anel branco por dentro do quadrado.
- Dados de exemplo aparecem marcados com o selo "Dados de exemplo".

## Cores

| Papel | Tokens | Onde |
| --- | --- | --- |
| Fundo | `surface-muted` | A página, atrás dos cartões |
| Cartões e barras | `surface` | Cartões, folha, campos, barra superior e de abas |
| Ativo | `surface-sunken` | Aba ativa, item de menu ativo, trilho de segmentado |
| Texto | `ink`, `ink-muted` | Principal e secundário |
| Ação | `primary`, `on-primary` | Botão principal, Lançar central, segmentado selecionado, interruptor ligado |
| Linhas | `border`, `divider`, `border-control` | Cartões, listas, campos |
| Dinheiro | `money-in`, `money-out` e as versões `-soft` | Valores e ícones de entrada e saída |
| Faixa do saldo | `zone-*`, `on-zone`, `on-zone-strong` | Chips de saldo, mapa do ano, legenda |

A faixa tem limites que a pessoa ajusta em Ajustes (padrão: 0, 1.000, 2.000 e 4.000). Os tons foram escolhidos menos saturados de propósito: um mês inteiro de chips não pode cansar a vista. As faixas diferem também em claridade, não só em matiz, e o número dentro do chip garante a leitura sem depender da cor.

## Tipografia

Uma família: **Montserrat** (Google Fonts, 400, 500, 600 e 700). Hierarquia por tamanho e peso.

- `display` (40/700): um número por tela, o mais importante.
- `title` (26/700) e `heading` (18/700) para títulos.
- `section` (16/600) para título de cartão.
- `body`, `body-strong`, `label`, `caption` para o resto.
- `chip` (10/700) só para o saldo dentro do calendário no celular.
- Números sempre com `font-variant-numeric: tabular-nums`.

## Forma e espaço

- Base de 4px. Margem lateral de 16px no celular; cartões com padding de 20px.
- Botões, pílulas e segmentados com `radius-pill`; cartões com `radius-lg`; campos e células com `radius-md`; chips de saldo com `radius-sm`; a folha que sobe com `radius-sheet` nos cantos de cima.
- Sem sombras, com duas exceções: o botão Lançar central, que se destaca da barra com um anel branco, e a folha de lançamento sobre o `scrim`.

## Ícones

Traço de 1,7px em grade de 24, pontas e junções redondas, sem preenchimento, na cor do texto. Entrada e saída usam seta para cima e para baixo dentro de um círculo `money-in-soft` ou `money-out-soft`. Nunca emoji.

## Padrões do produto

- **Calendário do mês:** cada dia mostra o número e o saldo do fim do dia num chip da faixa. Hoje tem o número em círculo `primary`. Tocar num dia abre a folha do dia.
- **Mapa do ano:** 12 meses, um quadrado por dia, colorido pela faixa. Dias futuros levam um anel branco por dentro.
- **Lançar:** no celular, botão redondo `primary` no centro da barra de abas; na web, botão no topo do menu lateral. Abre a folha com Entrada, Saída ou Diário, valor, categoria, parcelas e "Repete todo mês".
- **Economia:** reservas com saldo próprio. Aporte sai da conta e entra na reserva; resgate faz o contrário.
