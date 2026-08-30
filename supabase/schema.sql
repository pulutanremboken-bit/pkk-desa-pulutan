create table if not exists public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'Kegiatan PKK',
  event_date date not null,
  location text,
  excerpt text,
  content text not null,
  cover_url text,
  gallery_urls text[] default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.kegiatan enable row level security;

create policy "public can read published kegiatan"
on public.kegiatan for select
using (published = true);

create policy "authenticated can read all kegiatan"
on public.kegiatan for select
to authenticated
using (true);

create policy "authenticated can insert kegiatan"
on public.kegiatan for insert
to authenticated
with check (true);

create policy "authenticated can update kegiatan"
on public.kegiatan for update
to authenticated
using (true)
with check (true);

create policy "authenticated can delete kegiatan"
on public.kegiatan for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('kegiatan', 'kegiatan', true)
on conflict (id) do update set public = true;

create policy "public can view kegiatan images"
on storage.objects for select
using (bucket_id = 'kegiatan');

create policy "authenticated can upload kegiatan images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'kegiatan');

create policy "authenticated can update kegiatan images"
on storage.objects for update
to authenticated
using (bucket_id = 'kegiatan');

create policy "authenticated can delete kegiatan images"
on storage.objects for delete
to authenticated
using (bucket_id = 'kegiatan');
