CREATE TABLE public.finance_ai_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  service text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped')),
  budget numeric NOT NULL DEFAULT 0 CHECK (budget >= 0),
  spike_threshold numeric NOT NULL DEFAULT 0 CHECK (spike_threshold >= 0),
  auto_stop_percent numeric NOT NULL DEFAULT 90 CHECK (auto_stop_percent >= 1 AND auto_stop_percent <= 100),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, service)
);
GRANT SELECT ON public.finance_ai_controls TO anon, authenticated;
GRANT ALL ON public.finance_ai_controls TO service_role;
ALTER TABLE public.finance_ai_controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "finance_ai_controls_read_anon" ON public.finance_ai_controls FOR SELECT TO anon USING (true);
CREATE POLICY "finance_ai_controls_read_auth" ON public.finance_ai_controls FOR SELECT TO authenticated USING (true);

INSERT INTO public.finance_ai_controls (provider, service, status, budget, spike_threshold, auto_stop_percent)
SELECT provider, service, 'active', GREATEST(CEIL(SUM(cost) * 1.25), 1), GREATEST(CEIL(AVG(cost) * 2), 1), 90
FROM public.finance_ai_api_usage
GROUP BY provider, service
ON CONFLICT (provider, service) DO NOTHING;

CREATE OR REPLACE FUNCTION public.finance_adjust_wallet_atomic(
  p_wallet_id uuid,
  p_amount numeric,
  p_entry_type text,
  p_reason text,
  p_actor text,
  p_reference text
) RETURNS public.finance_wallets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.finance_wallets;
  v_next_balance numeric;
BEGIN
  IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be greater than zero'; END IF;
  IF p_entry_type NOT IN ('credit', 'debit') THEN RAISE EXCEPTION 'Invalid entry type'; END IF;
  IF btrim(p_reason) = '' THEN RAISE EXCEPTION 'A reason is required'; END IF;

  SELECT * INTO v_wallet FROM public.finance_wallets WHERE id = p_wallet_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF v_wallet.status = 'frozen' THEN RAISE EXCEPTION 'Frozen wallets cannot be adjusted'; END IF;

  v_next_balance := v_wallet.balance + CASE WHEN p_entry_type = 'credit' THEN p_amount ELSE -p_amount END;
  IF v_next_balance < 0 THEN RAISE EXCEPTION 'Adjustment would push the wallet balance below zero'; END IF;

  UPDATE public.finance_wallets
  SET balance = v_next_balance, last_activity_at = now()
  WHERE id = p_wallet_id
  RETURNING * INTO v_wallet;

  INSERT INTO public.finance_wallet_transactions
    (wallet_id, entry_type, amount, balance_after, reference, note, status, performed_by)
  VALUES
    (p_wallet_id, p_entry_type, p_amount, v_next_balance, p_reference, p_reason, 'completed', p_actor);

  RETURN v_wallet;
END;
$$;
REVOKE ALL ON FUNCTION public.finance_adjust_wallet_atomic(uuid, numeric, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finance_adjust_wallet_atomic(uuid, numeric, text, text, text, text) TO service_role;