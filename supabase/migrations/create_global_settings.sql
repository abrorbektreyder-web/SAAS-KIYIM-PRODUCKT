-- ============================================================
-- GLOBAL SETTINGS TABLE — Super Admin sozlamalari
-- Supabase SQL Editor'da ishga tushiring
-- ============================================================

CREATE TABLE IF NOT EXISTS public.global_settings (
    key   TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS — faqat service_role (supabaseAdmin) kirishi mumkin
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.global_settings
    FOR ALL USING (true) WITH CHECK (true);

-- Defolt sozlamalarni qo'shish
INSERT INTO public.global_settings (key, value) VALUES
    ('platform_name', 'HOYR'),
    ('base_url', 'https://hoyr.uz'),
    ('support_email', 'support@hoyr.uz'),
    ('seo_description', 'HOYR B2B Platformasi - Butiklar va kiyim do''konlarini boshqarish uchun eng qulay SAAS yechimi.')
ON CONFLICT (key) DO NOTHING;
