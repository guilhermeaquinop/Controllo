-- Controllo — migration inicial
-- Seis tabelas, todas por usuário e protegidas por RLS. Valores em centavos (bigint).
-- O saldo não é guardado: é calculado a partir dos lançamentos (ver lib/calculo/).

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type public.tipo_lancamento as enum ('entrada', 'saida', 'diario');
create type public.grupo_categoria as enum ('saida', 'entrada');

-- ---------------------------------------------------------------------------
-- perfis: 1:1 com auth.users
-- ---------------------------------------------------------------------------
create table public.perfis (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text not null default '',
  criado_em  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- configuracoes: uma linha por usuário
-- ---------------------------------------------------------------------------
create table public.configuracoes (
  usuario_id              uuid primary key references auth.users (id) on delete cascade,
  saldo_inicial_centavos  bigint not null default 0,
  saldo_inicial_data      date   not null default (now() at time zone 'America/Sao_Paulo')::date,
  faixa_1                 bigint not null default 100000,  -- R$ 1.000,00
  faixa_2                 bigint not null default 200000,  -- R$ 2.000,00
  faixa_3                 bigint not null default 400000,  -- R$ 4.000,00
  previsao_conta_diario   boolean not null default true,
  atualizado_em           timestamptz not null default now(),
  constraint faixas_crescentes check (faixa_1 < faixa_2 and faixa_2 < faixa_3)
);

-- ---------------------------------------------------------------------------
-- categorias
-- ---------------------------------------------------------------------------
create table public.categorias (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references auth.users (id) on delete cascade,
  nome        text not null check (length(trim(nome)) between 1 and 40),
  grupo       public.grupo_categoria not null,
  ordem       int  not null default 0,
  arquivada   boolean not null default false,
  criado_em   timestamptz not null default now(),
  unique (usuario_id, grupo, nome),
  unique (id, usuario_id)
);

-- ---------------------------------------------------------------------------
-- reservas (Economia)
-- ---------------------------------------------------------------------------
create table public.reservas (
  id                      uuid primary key default gen_random_uuid(),
  usuario_id              uuid not null references auth.users (id) on delete cascade,
  nome                    text not null check (length(trim(nome)) between 1 and 40),
  meta_centavos           bigint check (meta_centavos is null or meta_centavos > 0),
  saldo_inicial_centavos  bigint not null default 0,
  ordem                   int  not null default 0,
  arquivada               boolean not null default false,
  criado_em               timestamptz not null default now(),
  unique (usuario_id, nome),
  unique (id, usuario_id)
);

-- ---------------------------------------------------------------------------
-- recorrencias: a regra do "Repete todo mês"
-- ---------------------------------------------------------------------------
create table public.recorrencias (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references auth.users (id) on delete cascade,
  tipo            public.tipo_lancamento not null,
  valor_centavos  bigint not null check (valor_centavos > 0),
  categoria_id    uuid,
  reserva_id      uuid,
  descricao       text not null default '' check (length(descricao) <= 80),
  dia_do_mes      smallint not null check (dia_do_mes between 1 and 31),
  inicio          date not null,
  fim             date,
  gerado_ate      date not null,
  criado_em       timestamptz not null default now(),
  unique (id, usuario_id),
  foreign key (categoria_id, usuario_id) references public.categorias (id, usuario_id),
  foreign key (reserva_id, usuario_id)   references public.reservas (id, usuario_id),
  constraint recorrencia_um_destino check ((categoria_id is null) <> (reserva_id is null)),
  constraint recorrencia_reserva_tipo check (reserva_id is null or tipo in ('entrada', 'saida')),
  constraint recorrencia_periodo check (fim is null or fim >= inicio)
);

-- ---------------------------------------------------------------------------
-- lancamentos
-- ---------------------------------------------------------------------------
create table public.lancamentos (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid not null references auth.users (id) on delete cascade,
  data            date not null,
  tipo            public.tipo_lancamento not null,
  valor_centavos  bigint not null check (valor_centavos > 0),
  categoria_id    uuid,
  reserva_id      uuid,
  descricao       text not null default '' check (length(descricao) <= 80),
  grupo_id        uuid,                       -- parcelas da mesma compra
  parcela_numero  smallint,
  parcela_total   smallint,
  recorrencia_id  uuid,
  editado_manual  boolean not null default false,  -- gerado por recorrência e depois alterado
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  foreign key (categoria_id, usuario_id)   references public.categorias (id, usuario_id),
  foreign key (reserva_id, usuario_id)     references public.reservas (id, usuario_id),
  foreign key (recorrencia_id, usuario_id) references public.recorrencias (id, usuario_id) on delete set null (recorrencia_id),
  constraint lancamento_um_destino check ((categoria_id is null) <> (reserva_id is null)),
  constraint lancamento_reserva_tipo check (reserva_id is null or tipo in ('entrada', 'saida')),
  constraint lancamento_parcela check (
    (grupo_id is null and parcela_numero is null and parcela_total is null)
    or (grupo_id is not null and parcela_total between 2 and 48 and parcela_numero between 1 and parcela_total)
  )
);

create index lancamentos_usuario_data on public.lancamentos (usuario_id, data);
create index lancamentos_grupo        on public.lancamentos (grupo_id) where grupo_id is not null;
create index lancamentos_recorrencia  on public.lancamentos (recorrencia_id) where recorrencia_id is not null;
create index lancamentos_reserva      on public.lancamentos (usuario_id, reserva_id) where reserva_id is not null;

-- atualizado_em automático
create function public.tocar_atualizado_em() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

create trigger lancamentos_atualizado_em before update on public.lancamentos
  for each row execute function public.tocar_atualizado_em();
create trigger configuracoes_atualizado_em before update on public.configuracoes
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- RLS: cada pessoa só vê e altera as próprias linhas
-- ---------------------------------------------------------------------------
alter table public.perfis        enable row level security;
alter table public.configuracoes enable row level security;
alter table public.categorias    enable row level security;
alter table public.reservas      enable row level security;
alter table public.recorrencias  enable row level security;
alter table public.lancamentos   enable row level security;

create policy perfis_dono on public.perfis
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy configuracoes_dono on public.configuracoes
  for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy categorias_dono on public.categorias
  for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy reservas_dono on public.reservas
  for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy recorrencias_dono on public.recorrencias
  for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

create policy lancamentos_dono on public.lancamentos
  for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Saldo antes de uma data: a única soma feita no banco.
-- Entrada soma; Saída e Diário subtraem. Conta só a partir do saldo inicial.
-- security invoker: respeita o RLS de quem chama.
-- ---------------------------------------------------------------------------
create function public.saldo_antes_de(p_data date) returns bigint
language sql stable security invoker as $$
  select c.saldo_inicial_centavos + coalesce((
    select sum(case when l.tipo = 'entrada' then l.valor_centavos else -l.valor_centavos end)
    from public.lancamentos l
    where l.usuario_id = auth.uid()
      and l.data >= c.saldo_inicial_data
      and l.data <  p_data
  ), 0)
  from public.configuracoes c
  where c.usuario_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Primeiro acesso: perfil, configurações e categorias padrão.
-- Idempotente: pode ser chamada de novo sem duplicar nada.
-- ---------------------------------------------------------------------------
create function public.criar_dados_iniciais(p_saldo_centavos bigint default 0, p_data date default null)
returns void
language plpgsql security invoker as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'sem usuário autenticado';
  end if;

  insert into public.perfis (id) values (uid) on conflict do nothing;

  insert into public.configuracoes (usuario_id, saldo_inicial_centavos, saldo_inicial_data)
  values (uid, p_saldo_centavos, coalesce(p_data, (now() at time zone 'America/Sao_Paulo')::date))
  on conflict (usuario_id) do nothing;

  insert into public.categorias (usuario_id, nome, grupo, ordem)
  select uid, c.nome, c.grupo::public.grupo_categoria, c.ordem
  from (values
    ('Moradia', 'saida', 1), ('Fatura do cartão', 'saida', 2), ('Contas e boletos', 'saida', 3),
    ('Mercado', 'saida', 4), ('Alimentação', 'saida', 5), ('Transporte', 'saida', 6),
    ('Saúde', 'saida', 7), ('Lazer', 'saida', 8), ('Assinaturas', 'saida', 9), ('Outros', 'saida', 10),
    ('Salário / pró-labore', 'entrada', 1), ('Renda extra', 'entrada', 2), ('Outras entradas', 'entrada', 3)
  ) as c (nome, grupo, ordem)
  on conflict (usuario_id, grupo, nome) do nothing;
end $$;

grant execute on function public.saldo_antes_de(date) to authenticated;
grant execute on function public.criar_dados_iniciais(bigint, date) to authenticated;
