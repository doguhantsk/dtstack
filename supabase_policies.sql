-- Supabase RLS policies for allowing admins to update other users' roles
-- Run this in Supabase SQL editor after you have the `profiles` table

-- Ensure RLS is enabled
alter table if exists public.profiles enable row level security;

-- Allow authenticated users to select their own profile
create policy if not exists "Profiles: select authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Admin-specific policies removed: project no longer uses an admin role.
-- If you need to reintroduce admin behaviour later, add targeted policies here.
