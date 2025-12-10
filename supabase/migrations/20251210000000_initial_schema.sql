-- Create the tickets table
create table if not exists tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_name text not null,
  user_phone text not null,
  user_email text,
  event_date date not null,
  status text not null default 'booked', -- 'booked', 'used'
  ticket_code text not null unique
);

-- Create event_dates table
create table if not exists event_dates (
  id uuid default gen_random_uuid() primary key,
  event_date date not null unique,
  capacity int not null default 5000,
  booked_count int not null default 0
);

alter table tickets enable row level security;
alter table event_dates enable row level security;

-- Policies
create policy "Enable read for everyone" on tickets for select using (true);
create policy "Enable read access for all users" on event_dates for select using (true);

-- Function to book ticket
create or replace function book_ticket(
  p_user_name text,
  p_user_phone text,
  p_user_email text,
  p_event_date date
) returns json as $$
declare
  v_ticket_id uuid;
  v_ticket_code text;
  v_event_id uuid;
  v_current_count int;
  v_capacity int;
begin
  -- Lock the event_date row
  select id, booked_count, capacity into v_event_id, v_current_count, v_capacity
  from event_dates
  where event_date = p_event_date
  for update;

  if v_event_id is null then
    raise exception 'Event date not found';
  end if;

  if v_current_count >= v_capacity then
    raise exception 'Sold out for this date';
  end if;

  -- Generate ticket code
  v_ticket_code := 'TKT-' || to_char(p_event_date, 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));

  -- Insert ticket
  insert into tickets (user_name, user_phone, user_email, event_date, ticket_code, status)
  values (p_user_name, p_user_phone, p_user_email, p_event_date, v_ticket_code, 'booked')
  returning id into v_ticket_id;

  -- Update count
  update event_dates
  set booked_count = booked_count + 1
  where id = v_event_id;

  return json_build_object('id', v_ticket_id, 'ticket_code', v_ticket_code);
end;
$$ language plpgsql security definer;

-- Seed data (example)
-- insert into event_dates (event_date, capacity) values ('2025-12-20', 5000);
