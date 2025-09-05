-- =============================================================
-- Kalamkar: Full Supabase bootstrap (schema + storage + policies)
-- Run this WHOLE file once in the Supabase SQL Editor (DB: postgres)
-- Idempotent: guarded by IF EXISTS/DO blocks where possible
-- =============================================================

-- 0) Extensions (safe to run)
create extension if not exists pgcrypto;

-- =============================================================
-- 1) Tables
-- =============================================================

-- products
create table if not exists public.products (
  id bigserial primary key,
  created_at timestamptz default now(),
  name text not null,
  description text,
  price numeric,
  category text,
  imageUrl text,
  available_sizes text[],
  quantity integer not null default 0,
  ordered_quantity integer not null default 0
);

-- indexes + comments
create index if not exists idx_products_quantity on public.products(quantity);
create index if not exists idx_products_ordered_quantity on public.products(ordered_quantity);
comment on column public.products.quantity is 'Total quantity of the product available';
comment on column public.products.ordered_quantity is 'Quantity of the product that has been ordered';

-- site_settings
create table if not exists public.site_settings (
  id bigserial primary key,
  setting_name text not null unique,
  created_at timestamptz default now(),
  setting_value text
);

-- orders
create table if not exists public.orders (
  id bigserial primary key,
  created_at timestamptz default now(),
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_address text,
  order_items jsonb,
  total_price numeric,
  status text,
  user_id uuid,
  is_custom boolean default false,
  payment_method text,
  payment_screenshot_url text,
  custom_request_description text,
  custom_request_image_url text,
  amount_paid numeric,
  payment_status text,
  estimated_delivery_date date
);

-- FK to auth.users (nullable; set null on delete)
do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_user_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete set null;
  end if;
end $$;

-- notifications
create table if not exists public.notifications (
  id bigserial primary key,
  title text,
  message text,
  created_at timestamptz default now(),
  scheduled_at timestamptz,
  is_scheduled boolean not null default false,
  is_read boolean default false,
  type varchar(50) default 'announcement',
  priority varchar(20) default 'normal',
  is_active boolean default true,
  expires_at timestamptz
);

-- constraints + indexes
alter table public.notifications
  add constraint if not exists check_notification_type
  check (type in ('announcement','update','maintenance','promotion'));

alter table public.notifications
  add constraint if not exists check_notification_priority
  check (priority in ('low','normal','high','urgent'));

create index if not exists idx_notifications_created_at on public.notifications(created_at desc);
create index if not exists idx_notifications_type on public.notifications(type);
create index if not exists idx_notifications_is_active on public.notifications(is_active);
create index if not exists idx_notifications_expires_at on public.notifications(expires_at);
create index if not exists idx_notifications_scheduled_at on public.notifications(scheduled_at);
create index if not exists idx_notifications_is_scheduled on public.notifications(is_scheduled);

comment on table public.notifications is 'Stores system notifications for user communication';
comment on column public.notifications.title is 'Notification title';
comment on column public.notifications.type is 'announcement | update | maintenance | promotion';
comment on column public.notifications.priority is 'low | normal | high | urgent';
comment on column public.notifications.is_active is 'Whether the notification is currently active';
comment on column public.notifications.expires_at is 'Expiry (NULL = never)';

-- Active notifications view
create or replace view public.active_notifications as
select id, title, message, type, priority, created_at, expires_at
from public.notifications
where is_active = true and (expires_at is null or expires_at > now())
order by created_at desc;

-- Expiry maintenance function
create or replace function public.deactivate_expired_notifications()
returns void language plpgsql as $$
begin
  update public.notifications
  set is_active = false
  where expires_at is not null and expires_at <= now() and is_active = true;
end;$$;

-- Optional: keep RLS disabled for these public tables (matches screenshots)
alter table if exists public.products disable row level security;
alter table if exists public.orders disable row level security;
alter table if exists public.notifications disable row level security;
alter table if exists public.site_settings disable row level security;

-- Basic grants (adjust as needed)
grant select, insert, update, delete on public.products to authenticated;
grant usage on sequence public.products_id_seq to authenticated;

grant select, insert, update, delete on public.notifications to authenticated;
grant usage on sequence public.notifications_id_seq to authenticated;

-- =============================================================
-- 2) Storage: buckets + policies (requires storage schema)
-- =============================================================

-- Helper to create bucket if missing
do $$ begin
  if not exists (
    select 1 from storage.buckets where id = 'product-images'
  ) then
    perform storage.create_bucket('product-images', public => true);
  end if;
  if not exists (
    select 1 from storage.buckets where id = 'payment-screenshots'
  ) then
    perform storage.create_bucket('payment-screenshots', public => true);
  end if;
  if not exists (
    select 1 from storage.buckets where id = 'site-assets'
  ) then
    perform storage.create_bucket('site-assets', public => true);
  end if;
  if not exists (
    select 1 from storage.buckets where id = 'custom-requests'
  ) then
    perform storage.create_bucket('custom-requests', public => true);
  end if;
  if not exists (
    select 1 from storage.buckets where id = 'manual-order-designs'
  ) then
    perform storage.create_bucket('manual-order-designs', public => true);
  end if;
end $$;

-- Enable RLS on storage.objects (default in Supabase, re-assert)
alter table if exists storage.objects enable row level security;

-- Drop conflicting policies if already exist (safe)
do $$ begin
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_read_site_assets';
  if found then execute 'drop policy public_read_site_assets on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_insert_site_assets';
  if found then execute 'drop policy public_insert_site_assets on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auth_insert_product_images';
  if found then execute 'drop policy auth_insert_product_images on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auth_insert_payment_screens';
  if found then execute 'drop policy auth_insert_payment_screens on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_read_custom_requests';
  if found then execute 'drop policy public_read_custom_requests on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_insert_custom_requests';
  if found then execute 'drop policy public_insert_custom_requests on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auth_insert_manual_designs';
  if found then execute 'drop policy auth_insert_manual_designs on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_read_product_images';
  if found then execute 'drop policy public_read_product_images on storage.objects'; end if;
  perform 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public_read_payment_screens';
  if found then execute 'drop policy public_read_payment_screens on storage.objects'; end if;
end $$;

-- Site assets: public read + public insert
create policy public_read_site_assets on storage.objects
  for select
  using (bucket_id = 'site-assets');

create policy public_insert_site_assets on storage.objects
  for insert to public
  with check (bucket_id = 'site-assets');

-- Product images: authenticated insert, public read
create policy auth_insert_product_images on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images');

create policy public_read_product_images on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Payment screenshots: authenticated insert (read policy optional; keep readable per bucket visibility)
create policy auth_insert_payment_screens on storage.objects
  for insert to authenticated
  with check (bucket_id = 'payment-screenshots');

-- If you want public read for payment screenshots (matches bucket marked Public)
create policy public_read_payment_screens on storage.objects
  for select
  using (bucket_id = 'payment-screenshots');

-- Custom requests: public insert + public read
create policy public_insert_custom_requests on storage.objects
  for insert to public
  with check (bucket_id = 'custom-requests');

create policy public_read_custom_requests on storage.objects
  for select
  using (bucket_id = 'custom-requests');

-- Manual order designs: authenticated insert (no public read policy added by default)
create policy auth_insert_manual_designs on storage.objects
  for insert to authenticated
  with check (bucket_id = 'manual-order-designs');

-- =============================================================
-- 3) Seed (optional minimal)
-- =============================================================
insert into public.site_settings (setting_name, setting_value)
select 'site_name','Kalamkar' where not exists (
  select 1 from public.site_settings where setting_name='site_name'
);

-- =============================================================
-- End of file
-- =============================================================


