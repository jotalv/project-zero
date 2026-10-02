-- Tabela de perfil do jogador, 1:1 com auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  nome text not null default 'Jogador',
  nivel integer not null default 1,
  classe text not null default 'Humano',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Usuários veem o próprio perfil" on public.profiles;
create policy "Usuários veem o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Usuários atualizam o próprio perfil" on public.profiles;
create policy "Usuários atualizam o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Cria o perfil automaticamente quando um usuário se cadastra,
-- usando o nome informado no cadastro (user_metadata) quando houver
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nome', 'Jogador'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
