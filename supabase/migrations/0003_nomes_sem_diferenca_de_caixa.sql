-- Controllo — nomes únicos sem diferenciar maiúsculas
-- A 0001 impede "Mercado" duas vezes, mas aceita "Mercado" e "mercado" como coisas diferentes.
-- Estes índices tratam os dois como o mesmo nome (por usuário e grupo, nas categorias).
-- Se já houver repetidos assim no banco, a migration falha: renomeie um deles antes.

create unique index categorias_nome_sem_caixa
  on public.categorias (usuario_id, grupo, lower(nome));

create unique index reservas_nome_sem_caixa
  on public.reservas (usuario_id, lower(nome));
