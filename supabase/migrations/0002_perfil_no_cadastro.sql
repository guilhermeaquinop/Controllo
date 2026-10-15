-- Controllo — perfil criado junto com o cadastro
-- O nome digitado em "Criar conta" chega em auth.users.raw_user_meta_data ->> 'nome'.
-- Este gatilho cria a linha em public.perfis no mesmo instante, com o nome.
-- criar_dados_iniciais() continua com "on conflict do nothing" e não sobrescreve.

create function public.criar_perfil_no_cadastro() returns trigger
language plpgsql
security definer          -- grava em public.perfis em nome do Auth, antes de existir sessão
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(left(trim(new.raw_user_meta_data ->> 'nome'), 80), ''))
  on conflict (id) do nothing;
  return new;
end $$;

-- Só o próprio gatilho usa a função.
revoke execute on function public.criar_perfil_no_cadastro() from public, anon, authenticated;

create trigger perfil_no_cadastro
  after insert on auth.users
  for each row execute function public.criar_perfil_no_cadastro();
