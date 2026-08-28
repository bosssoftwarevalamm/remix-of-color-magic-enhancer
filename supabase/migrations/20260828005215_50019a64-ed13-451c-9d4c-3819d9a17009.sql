select setseed(0.4242);

insert into public.finance_wallets (owner_type, owner_name, owner_code, region, balance, low_balance_threshold) values
('master','Software Vala Master Wallet','SV-MASTER','India',4567890.00,500000);

insert into public.finance_wallets (owner_type, owner_name, owner_code, region, balance, low_balance_threshold)
select 'franchise', c||' Franchise', 'FR-'||(1000+i), c, round((45000+random()*845000)::numeric,2), 25000
from unnest(array['Delhi','Mumbai','Bengaluru','Hyderabad','Pune','Ahmedabad','Chennai','Kolkata','Jaipur','Lucknow','Indore','Surat']) with ordinality as t(c,i);

insert into public.finance_wallets (owner_type, owner_name, owner_code, region, balance, low_balance_threshold)
select 'reseller', c, 'RS-'||(2000+i), (array['Delhi','Mumbai','Bengaluru','Pune','Chennai'])[1+floor(random()*5)], round((12000+random()*308000)::numeric,2), 10000
from unnest(array['Nexa Tech Solutions','Orbit Software Hub','Zenith IT Partners','Vertex Digital','Aarav Systems','Skyline Softworks','Pinnacle Retail Tech','Quantum Vendors']) with ordinality as t(c,i);

insert into public.finance_wallets (owner_type, owner_name, owner_code, region, balance, low_balance_threshold)
select 'user', c, 'US-'||(3000+i), (array['Delhi','Mumbai','Bengaluru','Hyderabad','Jaipur'])[1+floor(random()*5)], round((500+random()*47500)::numeric,2), 2000
from unnest(array['Rohit Sharma','Ananya Iyer','Vikram Malhotra','Priya Nair','Karthik Reddy','Sneha Kulkarni','Imran Qureshi','Meera Desai','Aditya Ghosh','Neha Bansal']) with ordinality as t(c,i);

insert into public.finance_wallet_transactions (wallet_id, entry_type, amount, balance_after, reference, note, performed_by, created_at)
select w.id,
  e.et,
  round((1000+random()*84000)::numeric,2),
  round((w.balance*(0.6+random()*0.5))::numeric,2),
  'WTX-'||(100000+floor(random()*899999))::int,
  case e.et when 'topup' then 'Wallet top-up via UPI' when 'deduction' then 'Platform usage deduction' when 'transfer_in' then 'Internal transfer received' else 'Internal transfer sent' end,
  (array['finance.ops','arjun.mehta','system','kavya.rao'])[1+floor(random()*4)],
  now() - (random()*60||' days')::interval
from public.finance_wallets w
cross join lateral (select (array['topup','deduction','transfer_in','transfer_out'])[1+floor(random()*4)] as et from generate_series(1,6)) e;

insert into public.finance_transactions (txn_code, direction, amount, counterparty, counterparty_type, category, gateway, method, status, region, occurred_at, notes)
select 'TXN-'||(500000+g),
  d.dir,
  round((1500+random()*318500)::numeric,2),
  case when d.dir='credit' then (array['Delhi Franchise','Mumbai Franchise','Bengaluru Franchise','Pune Franchise','Nexa Tech Solutions','Orbit Software Hub','Zenith IT Partners','Rohit Sharma','Ananya Iyer','Meera Desai'])[1+floor(random()*10)]
       else (array['AWS Mumbai','OpenAI Platform','Google Cloud','Meta Ads','Payout Batch','Zoho Books','Support Team'])[1+floor(random()*7)] end,
  case when d.dir='credit' then (array['franchise','reseller','user'])[1+floor(random()*3)] else 'vendor' end,
  case when d.dir='credit' then (array['Subscription','Franchise Fee','Reseller Order','Plan Renewal','Setup Charges','Commission Recovery'])[1+floor(random()*6)]
       else (array['Server Cost','AI API Cost','Payout','Marketing Spend','Support Salary','Refund','Tool Subscription'])[1+floor(random()*7)] end,
  gw.code, gw.label,
  (array['completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','pending','pending','pending','failed','failed','partial','refunded'])[1+floor(random()*21)],
  (array['Delhi','Mumbai','Bengaluru','Hyderabad','Pune','Chennai','Kolkata','Jaipur'])[1+floor(random()*8)],
  now() - (random()*1800||' hours')::interval,
  'Auto-recorded ledger entry'
from generate_series(0,419) g
cross join lateral (select (array['credit','debit'])[1+floor(random()*2)] as dir) d
cross join lateral (select x.code, x.label from (values ('upi','UPI'),('bank','Bank Transfer'),('payu','PayU'),('stripe','Stripe'),('paypal','PayPal'),('crypto','Crypto')) as x(code,label) order by random() limit 1) gw;

insert into public.finance_gateways (code,name,provider,status,success_rate,fee_percent,settlement_cycle,monthly_volume,monthly_txn_count,supported_currencies) values
('upi','UPI / NPCI','NPCI','active',98.60,0.00,'T+1',8945000.00,4210,array['INR']),
('bank','Bank Transfer (NEFT/RTGS)','ICICI Bank','active',99.20,0.15,'T+1',12450000.00,860,array['INR']),
('payu','PayU','PayU India','active',96.40,2.00,'T+2',5320000.00,2980,array['INR']),
('stripe','Stripe','Stripe Inc.','active',97.80,2.90,'T+3',3210000.00,1140,array['USD','EUR','INR']),
('paypal','PayPal','PayPal Holdings','maintenance',94.10,3.40,'T+5',980000.00,320,array['USD','EUR','GBP']),
('crypto','Crypto (USDT)','Binance Pay','inactive',91.50,1.00,'T+0',410000.00,86,array['USDT','BTC']);

insert into public.finance_plans (code,name,price,billing_cycle,features) values
('SV-STARTER','Starter',2999,'monthly','["1 outlet","Basic POS","Email support","5 GB storage"]'::jsonb),
('SV-GROWTH','Growth',7999,'monthly','["5 outlets","Advanced POS + CRM","Priority support","50 GB storage","AI insights"]'::jsonb),
('SV-PRO','Professional',19999,'monthly','["20 outlets","Full ERP suite","24x7 support","250 GB storage","AI automation","API access"]'::jsonb),
('SV-ENTERPRISE','Enterprise',149999,'yearly','["Unlimited outlets","Dedicated cloud","Dedicated account manager","Unlimited storage","Custom AI models","White label"]'::jsonb),
('SV-FRANCHISE','Franchise Master',49999,'quarterly','["Franchise console","Sub-outlet billing","Commission engine","Regional analytics"]'::jsonb);

insert into public.finance_subscriptions (plan_id, customer_name, customer_type, amount, status, auto_renew, started_at, expires_at, previous_plan)
select p.id,
  cu.name, cu.ctype, p.price,
  s.st,
  random() < 0.72,
  st_date,
  case s.st when 'expired' then current_date - (1+floor(random()*90))::int
            when 'renewal_due' then current_date + (1+floor(random()*10))::int
            else st_date + (case p.billing_cycle when 'monthly' then 30 when 'quarterly' then 90 else 365 end * (1+floor(random()*3)))::int end,
  case when s.st in ('upgraded','downgraded') then (array['Starter','Growth','Professional'])[1+floor(random()*3)] end
from generate_series(1,90) g
cross join lateral (select id, price, billing_cycle from public.finance_plans order by random() limit 1) p
cross join lateral (select n.name, n.ctype from (values
  ('Delhi Franchise','franchise'),('Mumbai Franchise','franchise'),('Bengaluru Franchise','franchise'),('Pune Franchise','franchise'),('Chennai Franchise','franchise'),
  ('Nexa Tech Solutions','reseller'),('Orbit Software Hub','reseller'),('Zenith IT Partners','reseller'),('Vertex Digital','reseller'),
  ('Rohit Sharma','user'),('Ananya Iyer','user'),('Karthik Reddy','user'),('Meera Desai','user'),('Neha Bansal','user')) as n(name,ctype) order by random() limit 1) cu
cross join lateral (select (array['active','active','active','active','active','active','active','active','active','active','active','active','expired','expired','expired','expired','renewal_due','renewal_due','renewal_due','renewal_due','upgraded','upgraded','downgraded','downgraded','cancelled'])[1+floor(random()*25)] as st) s
cross join lateral (select (current_date - (30+floor(random()*670))::int) as st_date) d;

insert into public.finance_invoices (invoice_no, doc_type, client_name, client_type, gst_number, subtotal, tax_amount, total, status, auto_generated, issue_date, due_date, paid_at, line_items)
select 'INV-2026-'||(1000+g),
  (array['invoice','invoice','invoice','invoice','invoice','invoice','invoice','invoice','invoice','invoice','invoice','invoice','credit_note','debit_note'])[1+floor(random()*14)],
  cu.name, cu.ctype, '27AABCS'||(1000+g)||'Z5',
  a.sub, round(a.sub*0.18,2), round(a.sub*1.18,2),
  s.st, random() < 0.4,
  d.issue,
  case when s.st='overdue' then current_date - (1+floor(random()*60))::int else d.issue + 15 end,
  case when s.st='paid' then (d.issue + (1+floor(random()*14))::int)::timestamptz end,
  jsonb_build_array(jsonb_build_object('description',(array['Software Vala Growth Plan','Onboarding & Setup','POS Hardware Bundle','AI Add-on Pack','Annual AMC'])[1+floor(random()*5)],'qty',1+floor(random()*5),'rate',round(a.sub/2,2)))
from generate_series(0,119) g
cross join lateral (select round((2999+random()*246000)::numeric,2) as sub) a
cross join lateral (select (current_date - floor(random()*240)::int) as issue) d
cross join lateral (select (array['paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','unpaid','unpaid','unpaid','unpaid','overdue','overdue','overdue','draft','draft','cancelled'])[1+floor(random()*20)] as st) s
cross join lateral (select n.name, n.ctype from (values
  ('Delhi Franchise','franchise'),('Mumbai Franchise','franchise'),('Bengaluru Franchise','franchise'),('Hyderabad Franchise','franchise'),
  ('Nexa Tech Solutions','reseller'),('Orbit Software Hub','reseller'),('Vertex Digital','reseller'),
  ('Rohit Sharma','user'),('Priya Nair','user'),('Aditya Ghosh','user')) as n(name,ctype) order by random() limit 1) cu;

insert into public.finance_commissions (partner_name, partner_type, period, base_amount, rate_percent, commission_amount, status)
select p.name, p.ptype,
  (array['2026-05','2026-06','2026-07','2026-08'])[1+floor(random()*4)],
  b.base, r.rate, round(b.base*r.rate/100,2),
  (array['pending','pending','approved','approved','paid','paid','paid','hold'])[1+floor(random()*8)]
from generate_series(1,80) g
cross join lateral (select round((25000+random()*825000)::numeric,2) as base) b
cross join lateral (select (array[5,7.5,10,12,15,20])[1+floor(random()*6)]::numeric as rate) r
cross join lateral (select n.name, n.ptype from (values
  ('Delhi Franchise','franchise'),('Mumbai Franchise','franchise'),('Pune Franchise','franchise'),('Indore Franchise','franchise'),
  ('Nexa Tech Solutions','reseller'),('Skyline Softworks','reseller'),('Quantum Vendors','reseller'),
  ('Tech Guru Ravi','influencer'),('StartupDidi','influencer'),('CodeWithAman','influencer'),
  ('Amit Verma','sales'),('Sunita Rao','sales'),('Deepak Joshi','sales')) as n(name,ptype) order by random() limit 1) p;

insert into public.finance_payouts (payout_code, recipient_name, recipient_type, amount, method, bank_reference, status, requested_at, processed_at, reviewer_note)
select 'PO-'||(90000+g), p.name, p.rtype,
  round((5000+random()*445000)::numeric,2),
  (array['NEFT','IMPS','UPI','RTGS'])[1+floor(random()*4)],
  'UTR'||(100000000000+floor(random()*899999999999))::bigint,
  s.st,
  now() - (r.days||' days')::interval,
  case when s.st <> 'pending' then now() - (greatest(r.days-2,0)||' days')::interval end,
  case when s.st = 'rejected' then 'KYC documents incomplete' else 'Verified against commission ledger' end
from generate_series(0,69) g
cross join lateral (select (1+floor(random()*45))::int as days) r
cross join lateral (select (array['pending','pending','pending','pending','approved','approved','approved','paid','paid','paid','paid','paid','paid','rejected','processing','processing'])[1+floor(random()*16)] as st) s
cross join lateral (select n.name, n.rtype from (values
  ('Delhi Franchise','franchise'),('Mumbai Franchise','franchise'),('Jaipur Franchise','franchise'),
  ('Nexa Tech Solutions','reseller'),('Orbit Software Hub','reseller'),('Aarav Systems','reseller'),
  ('Tech Guru Ravi','partner'),('StartupDidi','partner'),('Amit Verma','partner')) as n(name,rtype) order by random() limit 1) p;

insert into public.finance_expenses (category, vendor, description, amount, expense_date, recurring, status)
select e.cat, e.vendor, e.descr,
  round((8000+random()*412000)::numeric,2),
  (date_trunc('month', current_date) - (m||' month')::interval)::date,
  e.rec,
  (array['approved','approved','approved','pending'])[1+floor(random()*4)]
from generate_series(0,5) m
cross join (values
  ('server','AWS Mumbai','EC2 + RDS production cluster',true),
  ('server','Cloudflare','CDN & WAF',true),
  ('ai_api','OpenAI Platform','GPT usage for Vala AI',true),
  ('ai_api','Google AI Studio','Gemini multimodal usage',true),
  ('marketing','Meta Ads','Lead generation campaign',false),
  ('marketing','Google Ads','Search campaign - POS keywords',false),
  ('support','Freshdesk','Support desk licences',true),
  ('salary','Payroll - Support','Monthly support team payroll',true),
  ('salary','Payroll - Engineering','Monthly engineering payroll',true),
  ('tools','Zoho Books','Accounting suite',true),
  ('tools','Figma','Design licences',true),
  ('misc','Office Utilities','Electricity & internet',false)) as e(cat,vendor,descr,rec);

insert into public.finance_ai_api_usage (provider, service, usage_date, requests, tokens, cost, billed_to)
select s.provider, s.service, (current_date - d)::date,
  r.reqs, r.reqs * (300+floor(random()*1500))::bigint,
  round((r.reqs * (300+floor(random()*1500)) * s.rate)::numeric,2),
  (array['Platform','Franchise Network','Reseller Network','Enterprise Clients'])[1+floor(random()*4)]
from generate_series(0,44) d
cross join (values
  ('OpenAI','gpt-5.2 chat',0.000012),
  ('Google','gemini-3.5-flash',0.0000042),
  ('OpenAI','embeddings',0.0000009),
  ('Google','gemini-3-pro-image',0.00021),
  ('Deepgram','speech-to-text',0.0000075)) as s(provider,service,rate)
cross join lateral (select (400+floor(random()*8600))::int as reqs) r;

insert into public.finance_refunds (refund_code, invoice_no, customer_name, amount, reason, mode, status, requested_at, processed_at, reviewer_note)
select 'RF-'||(7000+g),
  'INV-2026-'||(1000+floor(random()*120))::int,
  (array['Delhi Franchise','Mumbai Franchise','Nexa Tech Solutions','Vertex Digital','Rohit Sharma','Sneha Kulkarni','Neha Bansal'])[1+floor(random()*7)],
  round((999+random()*88000)::numeric,2),
  (array['Duplicate payment received','Service not activated','Downgrade adjustment','Failed onboarding','Billing error - overcharge','Customer cancellation within 7 days'])[1+floor(random()*6)],
  (array['Original Source','Bank Transfer','Wallet Credit'])[1+floor(random()*3)],
  s.st,
  now() - (r.days||' days')::interval,
  case when s.st <> 'requested' then now() - (greatest(r.days-3,0)||' days')::interval end,
  'Reviewed by finance controller'
from generate_series(0,44) g
cross join lateral (select (1+floor(random()*60))::int as days) r
cross join lateral (select (array['requested','requested','requested','approved','approved','approved','processed','processed','processed','processed','processed','rejected'])[1+floor(random()*12)] as st) s;

insert into public.finance_tax_records (period, tax_type, taxable_amount, tax_amount, filing_status, due_date, filed_at, reference_no)
select p.period, t.tt, a.taxable, round(a.taxable*t.rate,2), s.st, d.due,
  case when s.st='filed' then d.due - (1+floor(random()*10))::int end,
  case when s.st='filed' then 'ACK'||(100000000000+floor(random()*899999999999))::bigint end
from unnest(array['2025-Q3','2025-Q4','2026-Q1','2026-Q2','2026-07','2026-06','2026-05','2026-04']) as p(period)
cross join (values ('gst',0.18),('tds',0.10),('income_tax',0.25)) as t(tt,rate)
cross join lateral (select round((1500000+random()*8300000)::numeric,2) as taxable) a
cross join lateral (select (array['filed','filed','pending','overdue'])[1+floor(random()*4)] as st) s
cross join lateral (select (current_date - (floor(random()*210)-30)::int) as due) d;

insert into public.finance_alerts (title,message,severity,category,status,created_at)
select a.title, a.message, a.severity, a.category,
  (array['unread','unread','read','actioned'])[1+floor(random()*4)],
  now() - (floor(random()*72)||' hours')::interval
from (values
 ('Low wallet balance','Surat Franchise wallet dropped below the ₹25,000 threshold','high','wallet'),
 ('Payout awaiting approval','12 payout requests worth ₹18,45,000 are pending approval beyond SLA','critical','payout'),
 ('Gateway degraded','PayPal success rate fell to 94.1% in the last 24 hours','medium','gateway'),
 ('GST filing due','GST return for 2026-07 is due in 6 days','high','tax'),
 ('Unusual refund volume','Refund requests up 38% week-over-week','medium','refund'),
 ('AI cost spike','Gemini image generation cost up 62% versus last week','medium','ai_api'),
 ('Invoice overdue','23 invoices worth ₹9,84,300 are overdue by more than 30 days','high','invoice'),
 ('Commission run completed','July commission run processed for 46 partners','info','commission'),
 ('Failed transactions','19 transactions failed on UPI in the last hour','critical','transaction'),
 ('Subscription renewals','31 subscriptions renew within the next 7 days','low','subscription')) as a(title,message,severity,category);

insert into public.finance_approvals (request_type, reference, amount, requested_by, status, notes, created_at)
select (array['Payout Release','Refund Approval','Expense Sign-off','Commission Override','Credit Note Issue','Plan Discount'])[1+floor(random()*6)],
  (array['PO-90012','RF-7003','EXP-2201','CM-4410','INV-2026-1042','SUB-3312'])[1+floor(random()*6)],
  round((5000+random()*645000)::numeric,2),
  (array['finance.ops','franchise.manager','reseller.desk','sales.lead'])[1+floor(random()*4)],
  (array['pending','pending','approved','rejected'])[1+floor(random()*4)],
  'Routed via finance approval matrix',
  now() - (floor(random()*30)||' days')::interval
from generate_series(1,35);

insert into public.finance_audit_logs (actor, actor_role, action, entity, entity_ref, severity, ip_address, user_agent, details, created_at)
select ac.actor, ac.role, av.action, av.entity,
  (array['PO-90021','INV-2026-1077','RF-7012','CM-4402','WL-FR-1003'])[1+floor(random()*5)],
  av.severity,
  '10.24.'||floor(random()*256)::int||'.'||(1+floor(random()*254))::int,
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/139.0 Safari/537.36',
  '{"source":"finance-console","result":"success"}'::jsonb,
  now() - (floor(random()*720)||' hours')::interval
from generate_series(1,140) g
cross join lateral (select x.actor, x.role from (values ('priya.nair','Finance Controller'),('arjun.mehta','Finance Manager'),('system','Automation'),('kavya.rao','Accounts Executive'),('rahul.singh','Auditor')) as x(actor,role) order by random() limit 1) ac
cross join lateral (select y.action, y.entity, y.severity from (values
  ('Approved payout','payout','critical'),('Rejected payout','payout','warning'),('Generated invoice','invoice','info'),
  ('Updated gateway config','gateway','critical'),('Exported ledger','report','warning'),('Adjusted commission rate','commission','critical'),
  ('Processed refund','refund','warning'),('Viewed wallet balances','wallet','info'),('Filed GST return','tax','info'),('Froze wallet','wallet','critical')) as y(action,entity,severity) order by random() limit 1) av;

insert into public.finance_fraud_alerts (alert_code, risk_score, entity, txn_reference, reason, amount, status, detected_at, resolved_at)
select 'FRD-'||(3100+g),
  (42+floor(random()*57))::int,
  (array['Delhi Franchise','Surat Franchise','Nexa Tech Solutions','Quantum Vendors','Imran Qureshi','Aditya Ghosh'])[1+floor(random()*6)],
  'TXN-'||(500000+floor(random()*420))::int,
  (array['Multiple failed card attempts from same IP','Velocity breach: 14 payments in 3 minutes','Refund requested minutes after payment','Mismatched billing geo vs IP geo','Round-tripping between linked wallets','Chargeback pattern detected','Unusual high-value transfer at 03:14 IST'])[1+floor(random()*7)],
  round((4000+random()*776000)::numeric,2),
  s.st,
  now() - (r.days||' days')::interval,
  case when s.st in ('cleared','blocked') then now() - (greatest(r.days-1,0)||' days')::interval end
from generate_series(0,37) g
cross join lateral (select (1+floor(random()*30))::int as days) r
cross join lateral (select (array['open','open','open','investigating','investigating','cleared','cleared','cleared','blocked','blocked'])[1+floor(random()*10)] as st) s;

insert into public.finance_daily_metrics (metric_date, revenue, expenses, profit, inflow, outflow, txn_count)
select d.dt, m.rev, m.exp, m.rev - m.exp, round((m.rev*(1.0+random()*0.15))::numeric,2), round((m.exp*(1.0+random()*0.10))::numeric,2), (180+floor(random()*1270))::int
from generate_series(0,180) g
cross join lateral (select (current_date - g)::date as dt) d
cross join lateral (select greatest(round(((520000 - g*900) * (case when extract(isodow from (current_date - g)) < 6 then 1.22 else 0.82 end) * (0.75+random()*0.55))::numeric,2), 120000) as rev) r
cross join lateral (select r.rev as rev, round((r.rev*(0.42+random()*0.26))::numeric,2) as exp) m;

insert into public.finance_activity_heat (activity_date, hour_slot, txn_count, volume)
select (current_date - d)::date, h,
  c.cnt,
  round((c.cnt * (1200+random()*4200))::numeric,2)
from generate_series(0,27) d
cross join generate_series(0,23) h
cross join lateral (select greatest(round(28 * (case when h between 10 and 14 then 3.1 when h between 18 and 21 then 2.4 when h <= 5 then 0.22 else 1.0 end) * (0.6+random()*0.8))::int, 0) as cnt) c;