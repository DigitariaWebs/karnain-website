-- Server-managed integration settings (Stripe keys). RLS enabled with NO policies, so the table
-- is unreachable via anon/authenticated tokens — only the service-role server reads/writes it.

create table if not exists public.app_settings (
  id text primary key default 'default',
  stripe_secret_key text,
  stripe_webhook_secret text,
  stripe_publishable_key text,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
-- deliberately no policies: deny all Data-API access; the service role bypasses RLS.

grant select, insert, update on public.app_settings to service_role;

insert into public.app_settings (id) values ('default') on conflict (id) do nothing;
