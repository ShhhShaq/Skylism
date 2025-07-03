-- Skylism Database Schema
-- Run this in your Supabase SQL editor

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  credits INTEGER DEFAULT 3, -- Free trial credits
  total_spent DECIMAL(10,2) DEFAULT 0
);

-- Create upload sessions table
CREATE TABLE public.upload_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  total_images INTEGER DEFAULT 0,
  processed_images INTEGER DEFAULT 0
);

-- Create images table
CREATE TABLE public.images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.upload_sessions(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  original_url TEXT NOT NULL,
  original_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed'))
);

-- Create edit jobs table
CREATE TABLE public.edit_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID REFERENCES public.images(id) NOT NULL,
  prompt TEXT NOT NULL,
  preset_used TEXT,
  api_provider TEXT NOT NULL,
  api_cost DECIMAL(10,4) NOT NULL,
  credits_charged INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create variations table
CREATE TABLE public.variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  edit_job_id UUID REFERENCES public.edit_jobs(id) NOT NULL,
  variation_url TEXT NOT NULL,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create final outputs table
CREATE TABLE public.final_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID REFERENCES public.images(id) NOT NULL,
  variation_id UUID REFERENCES public.variations(id) NOT NULL,
  upscaled_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON public.upload_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own images" ON public.images
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own edit jobs" ON public.edit_jobs
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.images WHERE id = image_id));

CREATE POLICY "Users can view own variations" ON public.variations
  FOR ALL USING (auth.uid() = (
    SELECT i.user_id FROM public.images i 
    JOIN public.edit_jobs ej ON ej.image_id = i.id 
    WHERE ej.id = edit_job_id
  ));

CREATE POLICY "Users can view own outputs" ON public.final_outputs
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.images WHERE id = image_id));

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_images_user_id ON public.images(user_id);
CREATE INDEX idx_images_session_id ON public.images(session_id);
CREATE INDEX idx_edit_jobs_status ON public.edit_jobs(status);
CREATE INDEX idx_edit_jobs_created ON public.edit_jobs(created_at DESC);
CREATE INDEX idx_upload_sessions_user_id ON public.upload_sessions(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to deduct credits atomically
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id UUID, amount INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users 
  SET credits = credits - amount 
  WHERE id = user_id AND credits >= amount;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(user_id UUID, amount INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users 
  SET credits = credits + amount 
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);