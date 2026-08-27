create extension if not exists pgcrypto;

create table public.finance_wallets (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('master','franchise','reseller','user')),
  owner_name text not null,
  owner_code text not null unique,
  region text not null default 'India',
  balance numeric(14,2) not null default 0,
  currency text not null default 'INR',
  low_balance_threshold numeric(14,2) not null default 5000,
  status text not null default 'active' check (status in ('active','frozen','closed')),
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.finance_wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.finance_wallets(id) on delete cascade,
  entry_type text not null check (entry_type in ('topup','deduction','transfer_in','transfer_out','credit','debit')),
  amount numeric(14,2) not null,
  balance_after numeric(14,2) not null,
  reference text not null,
  note text,
  status text not null default 'completed' check (status in ('completed','pending','failed')),
  performed_by text not null default 'system',
  created_at timestamptz not null default now()
);
create table public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  txn_code text not null unique,
  direction text not null check (direction in ('credit','debit')),
  amount numeric(14,2) not null,
  counterparty text not null,
  counterparty_type text not null,
  category text not null,
  gateway text,
  method text,
  status text not null check (status in ('completed','pending','failed','partial','refunded')),
  region text not null default 'India',
  occurred_at timestamptz not null default now(),
  notes text
);
create table public.finance_gateways (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  provider text not null,
  status text not null default 'active' check (status in ('active','inactive','maintenance')),
  success_rate numeric(5,2) not null default 0,
  fee_percent numeric(5,2) not null default 0,
  settlement_cycle text not null default 'T+2',
  monthly_volume numeric(14,2) not null default 0,
  monthly_txn_count integer not null default 0,
  supported_currencies text[] not null default array['INR'],
  last_sync_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.finance_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text not null unique,
  doc_type text not null default 'invoice' check (doc_type in ('invoice','credit_note','debit_note')),
  client_name text not null,
  client_type text not null,
  gst_number text,
  subtotal numeric(14,2) not null,
  tax_amount numeric(14,2) not null,
  total numeric(14,2) not null,
  status text not null check (status in ('paid','unpaid','overdue','draft','cancelled')),
  auto_generated boolean not null default false,
  issue_date date not null,
  due_date date not null,
  paid_at timestamptz,
  line_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table public.finance_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  price numeric(12,2) not null,
  billing_cycle text not null check (billing_cycle in ('monthly','quarterly','yearly')),
  features jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);
create table public.finance_subscriptions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.finance_plans(id) on delete restrict,
  customer_name text not null,
  customer_type text not null,
  amount numeric(12,2) not null,
  status text not null check (status in ('active','expired','renewal_due','upgraded','downgraded','cancelled')),
  auto_renew boolean not null default true,
  started_at date not null,
  expires_at date not null,
  previous_plan text,
  created_at timestamptz not null default now()
);
create table public.finance_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  partner_type text not null check (partner_type in ('franchise','reseller','influencer','sales')),
  period text not null,
  base_amount numeric(14,2) not null,
  rate_percent numeric(5,2) not null,
  commission_amount numeric(14,2) not null,
  status text not null check (status in ('pending','approved','paid','hold')),
  created_at timestamptz not null default now()
);
create table public.finance_payouts (
  id uuid primary key default gen_random_uuid(),
  payout_code text not null unique,
  recipient_name text not null,
  recipient_type text not null,
  amount numeric(14,2) not null,
  method text not null,
  bank_reference text,
  status text not null check (status in ('pending','approved','rejected','processing','paid','on_hold')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  reviewer_note text
);
create table public.finance_expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('server','ai_api','marketing','support','salary','tools','misc')),
  vendor text not null,
  description text not null,
  amount numeric(14,2) not null,
  expense_date date not null,
  recurring boolean not null default false,
  status text not null default 'approved' check (status in ('approved','pending','rejected')),
  created_at timestamptz not null default now()
);
create table public.finance_ai_api_usage (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  service text not null,
  usage_date date not null,
  requests integer not null,
  tokens bigint not null default 0,
  cost numeric(12,2) not null,
  billed_to text not null,
  created_at timestamptz not null default now()
);
create table public.finance_refunds (
  id uuid primary key default gen_random_uuid(),
  refund_code text not null unique,
  invoice_no text,
  customer_name text not null,
  amount numeric(12,2) not null,
  reason text not null,
  mode text not null,
  status text not null check (status in ('requested','approved','rejected','processed')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  reviewer_note text
);
create table public.finance_tax_records (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  tax_type text not null check (tax_type in ('gst','tds','income_tax')),
  taxable_amount numeric(14,2) not null,
  tax_amount numeric(14,2) not null,
  filing_status text not null check (filing_status in ('filed','pending','overdue')),
  due_date date not null,
  filed_at date,
  reference_no text,
  created_at timestamptz not null default now()
);
create table public.finance_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null check (severity in ('critical','high','medium','low','info')),
  category text not null,
  status text not null default 'unread' check (status in ('unread','read','actioned')),
  created_at timestamptz not null default now()
);
create table public.finance_approvals (
  id uuid primary key default gen_random_uuid(),
  request_type text not null,
  reference text not null,
  amount numeric(14,2) not null,
  requested_by text not null,
  status text not null check (status in ('pending','approved','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create table public.finance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  actor_role text not null,
  action text not null,
  entity text not null,
  entity_ref text,
  severity text not null default 'info' check (severity in ('critical','warning','info')),
  ip_address text not null,
  user_agent text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table public.finance_fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_code text not null unique,
  risk_score integer not null,
  entity text not null,
  txn_reference text,
  reason text not null,
  amount numeric(14,2) not null,
  status text not null check (status in ('open','investigating','cleared','blocked')),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz
);
create table public.finance_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null unique,
  revenue numeric(14,2) not null,
  expenses numeric(14,2) not null,
  profit numeric(14,2) not null,
  inflow numeric(14,2) not null,
  outflow numeric(14,2) not null,
  txn_count integer not null,
  created_at timestamptz not null default now()
);
create table public.finance_activity_heat (
  id uuid primary key default gen_random_uuid(),
  activity_date date not null,
  hour_slot smallint not null check (hour_slot between 0 and 23),
  txn_count integer not null,
  volume numeric(14,2) not null,
  unique (activity_date, hour_slot)
);

create index on public.finance_transactions (occurred_at desc);
create index on public.finance_wallet_transactions (wallet_id, created_at desc);
create index on public.finance_audit_logs (created_at desc);
create index on public.finance_invoices (status, issue_date desc);
create index on public.finance_daily_metrics (metric_date desc);

do $$
declare t text;
begin
  foreach t in array array[
    'finance_wallets','finance_wallet_transactions','finance_transactions','finance_gateways',
    'finance_invoices','finance_plans','finance_subscriptions','finance_commissions','finance_payouts',
    'finance_expenses','finance_ai_api_usage','finance_refunds','finance_tax_records','finance_alerts',
    'finance_approvals','finance_audit_logs','finance_fraud_alerts','finance_daily_metrics','finance_activity_heat'
  ] loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to anon using (true)', t||'_read_anon', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)', t||'_read_auth', t);
  end loop;
end $$;