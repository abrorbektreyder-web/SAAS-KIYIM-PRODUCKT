-- ============================================================
-- PRODUCT VARIANTS TABLE — Rang + O'lcham bo'yicha Variant Ombor
-- Supabase SQL Editor'da shu faylni ishga tushiring
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_variants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color         TEXT NOT NULL DEFAULT '',
  size          TEXT NOT NULL DEFAULT '',
  stock         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, color, size)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_product_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trigger_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION update_product_variants_updated_at();

-- RLS policies
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Allow service_role (supabaseAdmin) full access
CREATE POLICY "Service role full access" ON public.product_variants
  FOR ALL USING (true) WITH CHECK (true);
