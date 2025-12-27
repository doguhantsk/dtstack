-- Supabase SQL schema for DTStack
-- Run these statements in your Supabase SQL editor
-- Supabase SQL schema for DTStack
-- Paste all of this into Supabase SQL Editor and run

-- Ensure the pgcrypto extension is available for gen_random_uuid
create extension if not exists pgcrypto;

-- 1) profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text check (role in ('admin','client')) default 'client',
  full_name text
);

alter table public.profiles enable row level security;

create policy "Profiles: select for authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Profiles: admin manage" on public.profiles
  for insert, update, delete using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Optional: create profile automatically when auth.user created
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  category text,
  tags text[] default array[]::text[],
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

-- Public can read projects
create policy "Projects: public select" on public.projects
  for select using (true);

-- Only admins can insert/update/delete projects
create policy "Projects: admin write" on public.projects
  for insert, update, delete using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 3) contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  email text,
  phone text,
  services text[] default array[]::text[],
  budget text,
  message text,
  created_at timestamptz default now(),
  status text default 'new'
);

alter table public.contacts enable row level security;

-- Allow anonymous inserts for contact form (beware spam; consider captcha)
create policy "Contacts: allow insert" on public.contacts
  for insert with check (true);

-- Admins can select/update/delete contacts
create policy "Contacts: admin select" on public.contacts
  for select using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Contacts: admin write" on public.contacts
  for update, delete using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 4) testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text,
  position text,
  company text,
  comment text,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

create policy "Testimonials: public select" on public.testimonials
  for select using (true);

create policy "Testimonials: authenticated insert" on public.testimonials
  for insert using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Testimonials: admin write" on public.testimonials
  for update, delete using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- TEST DATA (sample projects, testimonials, contacts)
insert into public.projects (title, description, image_url, category, tags)
values
  ('DS Store Online Mağaza', 'Yüksek trafikli e-ticaret altyapısı.', 'https://placehold.co/800x500?text=DS+Store', 'E-Ticaret', array['ecommerce','stripe']),
  ('Vriano Kurumsal Site', 'Kurumsal vitrin ve katalog sitesi.', 'https://placehold.co/800x500?text=Vriano', 'Kurumsal', array['static','cms']),
  ('GastroRez Sistem', 'QR menü ve rezervasyon yönetimi', 'https://placehold.co/800x500?text=GastroRez', 'Web Uygulama', array['saas','restaurant']);

insert into public.testimonials (client_name, position, company, comment, rating)
values
  ('Merve Aksoy','Pazarlama Müdürü','Global Yapı','DTStack sayesinde dönüşümümüz %40 arttı.',5),
  ('Can Demir','CTO','StartupX','Hızlı ve güvenilir bir ekip.',4);

insert into public.contacts (name, company, email, phone, services, budget, message)
values
  ('Fatma K.', 'Beta Ltd.', 'fatma@beta.com', '+90 555 111 2222', array['Kurumsal Web Sitesi'], '₺20k - ₺50k', 'Yeni web sitemiz için teklif istiyoruz.'),
  ('Ozan Y.','Gamma A.Ş.','ozan@gamma.com','+90 555 333 4444', array['E-Ticaret'], '₺50k - ₺100k', 'E-ticaret projesi planlıyoruz.');

-- End of SQL
