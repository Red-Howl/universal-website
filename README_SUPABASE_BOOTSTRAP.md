### Supabase one-shot bootstrap

Run this file to recreate the database schema, storage buckets, and policies.

Steps

1) Open Supabase Project → SQL Editor
2) Paste contents of `supabase_full_setup.sql`
3) Run all statements once. It is idempotent.

Notes

- Tables: `products`, `orders`, `notifications`, `site_settings`
- View: `active_notifications`
- Function: `deactivate_expired_notifications`
- Storage buckets (public): `product-images`, `payment-screenshots`, `site-assets`, `custom-requests`, `manual-order-designs`
- Policies on `storage.objects` created to match screenshots: public read for public buckets; authenticated/public inserts as configured.
- RLS is disabled on the public tables, mirroring screenshots. Enable and adjust if stricter security is needed.

Re-running

- The script checks for existence and only creates what’s missing.

Rollbacks

- Use standard DROP statements if you need to remove objects.


