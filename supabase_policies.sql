-- Supabase RLS policies for allowing admins to update other users' roles
-- Run this in Supabase SQL editor after you have the `profiles` table

-- Ensure RLS is enabled
alter table if exists public.profiles enable row level security;

-- Allow authenticated users to select their own profile
create policy if not exists "Profiles: select authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Allow admins to manage (insert/update/delete) all profiles
create policy if not exists "Profiles: admin manage" on public.profiles
  for all using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- If you prefer a policy scoped only to updates of the role column, you can use:
create policy if not exists "Profiles: admin update role" on public.profiles
  for update using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Note: The policies above assume the `profiles` table contains a `role` column
-- and that an admin row exists with role = 'admin'.
