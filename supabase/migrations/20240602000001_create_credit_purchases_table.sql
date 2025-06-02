
-- Create credit_purchases table to track credit purchases
CREATE TABLE public.credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  package_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- Amount in USD (not cents)
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchases" ON public.credit_purchases
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow service role to insert and update for payment processing
CREATE POLICY "Service role can insert purchases" ON public.credit_purchases
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update purchases" ON public.credit_purchases
  FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_credit_purchases_user_id ON public.credit_purchases(user_id);
CREATE INDEX idx_credit_purchases_stripe_session_id ON public.credit_purchases(stripe_session_id);
CREATE INDEX idx_credit_purchases_status ON public.credit_purchases(status);
