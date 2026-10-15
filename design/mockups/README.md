# Mockups

Duas pastas, `celular/` (390px de largura) e `web/` (1440px). Em cada uma:

- `imagens/*.png`: a tela como deve ficar, em 2x. É a referência visual.
- `*.dc.html`: o código-fonte do mockup, com todas as medidas, cores e textos. Não roda sozinho (é o formato do canvas de design do claude.ai: `{{...}}`, `<sc-for>` e `<sc-if>` são preenchidos pela classe `Component` no fim do arquivo), mas serve para consultar valores exatos.

| Celular | Web |
| --- | --- |
| 0-entrar | 0-entrar |
| 1-mes | 1-mes (calendário + painel do dia) |
| 2-lancar-folha (a folha sobe sobre o mês) | — (na web é o painel à direita do mês) |
| 3-ano | 2-ano |
| 4-economia | 3-economia |
| 5-resumo | 4-resumo |
| 6-ajustes | — (seguir o celular, numa coluna de até 720px) |

Observações:

- Os números são do mês de exemplo (outubro de 2026, a planilha do usuário) e servem de caso de teste.
- Os links internos dos mockups (`Main.dc.html`, `Dia.dc.html`...) usam os nomes antigos dos arquivos.
- O calendário do mês nos mockups ainda não mostra o anel branco dos dias previstos; siga a especificação e o `DESIGN.md`.
- Ainda não desenhadas: Criar conta, Recuperar senha, Primeiro acesso, Editar lançamento, Nova reserva. Use os mesmos componentes do login e da folha do dia.
