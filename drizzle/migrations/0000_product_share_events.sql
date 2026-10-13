CREATE TABLE public.product_share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_name text NOT NULL,
  platform text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.product_share_events TO service_role;
ALTER TABLE public.product_share_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX product_share_events_platform_idx ON public.product_share_events(platform);