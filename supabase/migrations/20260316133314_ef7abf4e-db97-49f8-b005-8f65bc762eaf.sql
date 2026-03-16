-- User usage tracking table
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluations_used INTEGER NOT NULL DEFAULT 0,
  evaluations_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  amount_iqd INTEGER,
  activated_by TEXT NOT NULL DEFAULT 'system',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users read own usage" ON public.user_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users read own subscription" ON public.subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Security definer function to ensure user setup rows exist (called from edge function)
CREATE OR REPLACE FUNCTION public.ensure_user_setup(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_usage (user_id) VALUES (p_user_id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, plan, status) VALUES (p_user_id, 'free', 'active') ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to increment usage count atomically
CREATE OR REPLACE FUNCTION public.increment_user_eval(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_usage
  SET evaluations_used = evaluations_used + 1, updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

-- Admin function to activate PRO subscription
CREATE OR REPLACE FUNCTION public.activate_pro_subscription(
  target_user_id UUID,
  months INTEGER DEFAULT 12,
  payment_ref TEXT DEFAULT NULL,
  payment_amt INTEGER DEFAULT 15000
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id, plan, status, started_at, expires_at,
    payment_method, payment_reference, amount_iqd, activated_by
  ) VALUES (
    target_user_id, 'pro', 'active', NOW(),
    NOW() + INTERVAL '1 month' * months,
    'zaincash', payment_ref, payment_amt, 'admin_manual'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan = 'pro',
    status = 'active',
    expires_at = NOW() + INTERVAL '1 month' * months,
    payment_reference = payment_ref,
    amount_iqd = payment_amt,
    activated_by = 'admin_manual',
    started_at = NOW();
  
  -- Set unlimited evaluations for PRO
  UPDATE public.user_usage SET evaluations_limit = 999999 WHERE user_id = target_user_id;
END;
$$;