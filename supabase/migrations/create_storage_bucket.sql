-- ============================================================
-- SUPABASE STORAGE BUCKET SETUP — product-images
-- Supabase Dashboard > Storage yoki SQL Editor da ishlating
-- ============================================================

-- 1. Bucket yaratish (Supabase Dashboard > Storage > New Bucket)
-- Name: product-images
-- Public: TRUE (rasmlar ommaviy ko'rinishi uchun)

-- 2. SQL orqali bucket yaratish:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    5242880,  -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Siyosatlar — authenticated foydalanuvchilar yuklashi mumkin
CREATE POLICY "Auth users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Auth users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
