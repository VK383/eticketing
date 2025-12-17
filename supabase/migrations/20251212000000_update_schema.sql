-- Update the book_ticket function to handle dynamic date creation
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
  -- Lock the event_date row or create if doesn't exist
  select id, booked_count, capacity into v_event_id, v_current_count, v_capacity
  from event_dates
  where event_date = p_event_date
  for update;

  -- If event date doesn't exist, create it
  if v_event_id is null then
    insert into event_dates (event_date, capacity, booked_count)
    values (p_event_date, 5000, 0)
    returning id, booked_count, capacity into v_event_id, v_current_count, v_capacity;
  end if;

  -- Check capacity
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
