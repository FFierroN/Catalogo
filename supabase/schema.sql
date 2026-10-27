-- Esquema actual de la tabla en Supabase (ya aplicado en el proyecto bruma-catalogo).
-- Sirve como referencia o para recrearla en otro proyecto.

create table if not exists public.perfumes (
  id              uuid primary key default gen_random_uuid(),
  codigo          integer not null unique,   -- columna ID de tu CSV madre
  brand           text not null,             -- Marca
  name            text not null,             -- Nombre
  version         text,                      -- Flanker / Versión ("Standard" = versión base)
  concentration   text,                      -- Concentración (EDT, EDP, Parfum...)
  gender          text not null default 'Unisex', -- Género
  family          text not null,             -- Familia Olfativa completa
  family_main     text,                      -- primera palabra de la familia, para los filtros
  usage           text,                      -- Uso Ideal tal cual viene en el CSV
  usage_tags      text[] not null default '{}', -- Uso Ideal separado por "/" para filtrar
  size_ml         integer,                   -- opcional
  price           integer,                   -- opcional, en pesos (CLP)
  description     text,                      -- opcional
  notes_top       text[] not null default '{}',
  notes_heart     text[] not null default '{}',
  notes_base      text[] not null default '{}',
  color           text,                      -- opcional; si falta, la app usa un color según la familia
  image_url       text,                      -- URL pública de la foto (Supabase Storage)
  fragrantica_url text,                      -- link a la ficha en Fragantica
  visible         boolean not null default true, -- false = no aparece en la app
  created_at      timestamptz not null default now()
);

alter table public.perfumes enable row level security;

-- La app solo puede leer los perfumes visibles. Escribir solo se puede desde el panel de Supabase.
create policy "Lectura publica del catalogo"
  on public.perfumes for select
  to anon, authenticated
  using (visible);

create index if not exists perfumes_family_main_idx on public.perfumes (family_main);

-- Fotos: bucket público "perfumes" (Storage). URL pública:
-- https://TU-PROYECTO.supabase.co/storage/v1/object/public/perfumes/archivo.webp
