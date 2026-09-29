CREATE TABLE public.dashboard_details (
  target_key text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  ai_reason text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.dashboard_details TO service_role;
ALTER TABLE public.dashboard_details ENABLE ROW LEVEL SECURITY;