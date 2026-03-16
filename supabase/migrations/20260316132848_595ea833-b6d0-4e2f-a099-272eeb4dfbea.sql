CREATE TABLE public.app_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  evaluations_count integer NOT NULL DEFAULT 0,
  last_item_type text,
  last_governorate text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_stats ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read app stats"
  ON public.app_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role inserts/updates (via edge function)
-- No insert/update policy for regular users

-- Create a function to increment evaluation count
CREATE OR REPLACE FUNCTION public.increment_eval_count(p_date date, p_item_type text, p_governorate text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.app_stats (stat_date, evaluations_count, last_item_type, last_governorate, updated_at)
  VALUES (p_date, 1, p_item_type, p_governorate, now())
  ON CONFLICT (stat_date) DO UPDATE SET
    evaluations_count = app_stats.evaluations_count + 1,
    last_item_type = p_item_type,
    last_governorate = p_governorate,
    updated_at = now();
END;
$$;