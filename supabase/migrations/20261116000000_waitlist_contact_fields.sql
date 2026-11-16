-- Replace the legacy combined name/location fields with structured waitlist
-- data. New registrations must provide every field; `not valid` lets the
-- migration preserve historical rows that did not collect these details.

begin;

alter table public.waitlist_entries
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists whatsapp_phone text;

-- The previous API stored full_name and state_city as required fields. Keep
-- their existing values for history, but allow new structured records to omit
-- those legacy columns. The guards also make the migration safe when a
-- database was provisioned directly from the new schema.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'waitlist_entries'
      and column_name = 'full_name'
  ) then
    execute 'alter table public.waitlist_entries alter column full_name drop not null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'waitlist_entries'
      and column_name = 'state_city'
  ) then
    execute 'alter table public.waitlist_entries alter column state_city drop not null';
  end if;
end;
$$;

alter table public.waitlist_entries
  drop constraint if exists waitlist_entries_first_name_required,
  drop constraint if exists waitlist_entries_last_name_required,
  drop constraint if exists waitlist_entries_city_required,
  drop constraint if exists waitlist_entries_state_required,
  drop constraint if exists waitlist_entries_whatsapp_phone_required;

alter table public.waitlist_entries
  add constraint waitlist_entries_first_name_required
    check (first_name is not null and length(trim(first_name)) > 0) not valid,
  add constraint waitlist_entries_last_name_required
    check (last_name is not null and length(trim(last_name)) > 0) not valid,
  add constraint waitlist_entries_city_required
    check (city is not null and length(trim(city)) > 0) not valid,
  add constraint waitlist_entries_state_required
    check (state is not null and length(trim(state)) > 0) not valid,
  add constraint waitlist_entries_whatsapp_phone_required
    check (whatsapp_phone is not null and length(trim(whatsapp_phone)) > 0) not valid;

drop policy if exists "Allow public waitlist registrations" on public.waitlist_entries;
create policy "Allow public waitlist registrations"
  on public.waitlist_entries
  for insert
  to anon, authenticated
  with check (
    first_name is not null
    and length(trim(first_name)) > 0
    and last_name is not null
    and length(trim(last_name)) > 0
    and city is not null
    and length(trim(city)) > 0
    and state is not null
    and length(trim(state)) > 0
    and email is not null
    and length(trim(email)) > 0
    and whatsapp_phone is not null
    and length(trim(whatsapp_phone)) > 0
    and category in ('Driver', 'Rider')
  );

comment on column public.waitlist_entries.whatsapp_phone is
  'Required WhatsApp contact number submitted by a CitiRide waitlist user.';

commit;
