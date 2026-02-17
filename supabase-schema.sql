-- ============================================
-- CampusConnect – Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. EVENTS TABLE
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  time time not null,
  venue text not null,
  category text not null,
  organizer text not null,
  organizer_phone text,
  banner_url text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- 2. REGISTRATIONS TABLE
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  email text not null,
  roll_no text not null,
  created_at timestamptz default now()
);

-- 3. USERS TABLE (for role management)
create table if not exists public.users (
  id uuid references auth.users(id) primary key,
  email text not null,
  role text default 'student' check (role in ('admin', 'student')),
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.users enable row level security;

-- EVENTS: Anyone can read
create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

-- EVENTS: Only authenticated admins can insert
create policy "Admins can create events"
  on public.events for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- EVENTS: Only authenticated admins can update
create policy "Admins can update events"
  on public.events for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- EVENTS: Only authenticated admins can delete
create policy "Admins can delete events"
  on public.events for delete
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- REGISTRATIONS: Anyone can insert (students register without login)
create policy "Anyone can register for events"
  on public.registrations for insert
  with check (true);

-- REGISTRATIONS: Admins can view registrations
create policy "Admins can view registrations"
  on public.registrations for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- USERS: Users can read their own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- USERS: Allow insert for new user creation (triggered on signup)
create policy "Allow insert for auth trigger"
  on public.users for insert
  with check (auth.uid() = id);

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime on events table
alter publication supabase_realtime add table public.events;

-- ============================================
-- STORAGE BUCKET FOR BANNERS
-- ============================================
-- Run this separately in Storage settings or via SQL:

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- Storage policy: Anyone can view banners
create policy "Public banner access"
  on storage.objects for select
  using (bucket_id = 'banners');

-- Storage policy: Authenticated users can upload banners
create policy "Authenticated users can upload banners"
  on storage.objects for insert
  with check (bucket_id = 'banners' and auth.role() = 'authenticated');

-- Storage policy: Authenticated users can update their banners
create policy "Authenticated users can update banners"
  on storage.objects for update
  using (bucket_id = 'banners' and auth.role() = 'authenticated');

-- Storage policy: Authenticated users can delete banners
create policy "Authenticated users can delete banners"
  on storage.objects for delete
  using (bucket_id = 'banners' and auth.role() = 'authenticated');

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if any
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SEED DATA (Optional demo events)
-- ============================================

-- You can insert a few sample events after running this schema:
-- insert into public.events (title, description, date, time, venue, category, organizer)
-- values
--   ('TechFest 2026', 'Annual technology festival', '2026-03-15', '10:00', 'Main Auditorium', 'Technology', 'CSE Department'),
--   ('Cultural Night', 'Music and dance performances', '2026-03-20', '18:00', 'Open Air Theatre', 'Cultural', 'Student Council'),
--   ('Hackathon', '24-hour coding challenge', '2026-02-28', '09:00', 'CS Lab Block', 'Technology', 'Coding Club');
