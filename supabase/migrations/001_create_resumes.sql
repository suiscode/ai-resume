create extension if not exists "pgcrypto";

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source text not null check (source in ('pdf', 'text')),
  score integer not null check (score >= 0 and score <= 100),
  analysis jsonb not null,
  resume_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_created_at_idx
  on public.resumes (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_resumes_updated_at on public.resumes;
create trigger set_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

alter table public.resumes enable row level security;

create policy "resumes_select_own"
on public.resumes
for select
using (auth.uid() = user_id);

create policy "resumes_insert_own"
on public.resumes
for insert
with check (auth.uid() = user_id);

create policy "resumes_update_own"
on public.resumes
for update
using (auth.uid() = user_id);

create policy "resumes_delete_own"
on public.resumes
for delete
using (auth.uid() = user_id);
