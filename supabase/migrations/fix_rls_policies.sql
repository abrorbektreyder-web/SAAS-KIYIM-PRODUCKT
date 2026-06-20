-- ============================================================
-- RLS WITH CHECK Siyosatlari — Cross-Tenant Data Leak himoyasi
-- Supabase SQL Editor'da ishga tushirildi: 2026-06-20
-- ============================================================

-- Foydalanuvchining o'z tashkiloti (organization_id) ni aniqlovchi xavfsiz funksiya
CREATE OR REPLACE FUNCTION public.get_user_org_id() 
RETURNS UUID 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 1. PRODUCTS jadvali xavfsizligi
DROP POLICY IF EXISTS "products_insert_check" ON public.products;
CREATE POLICY "products_insert_check" ON public.products
FOR INSERT WITH CHECK (organization_id = public.get_user_org_id());

DROP POLICY IF EXISTS "products_update_check" ON public.products;
CREATE POLICY "products_update_check" ON public.products
FOR UPDATE USING (organization_id = public.get_user_org_id()) 
WITH CHECK (organization_id = public.get_user_org_id());

-- 2. ORDERS jadvali xavfsizligi
DROP POLICY IF EXISTS "orders_insert_check" ON public.orders;
CREATE POLICY "orders_insert_check" ON public.orders
FOR INSERT WITH CHECK (organization_id = public.get_user_org_id());

DROP POLICY IF EXISTS "orders_update_check" ON public.orders;
CREATE POLICY "orders_update_check" ON public.orders
FOR UPDATE USING (organization_id = public.get_user_org_id()) 
WITH CHECK (organization_id = public.get_user_org_id());

-- 3. CUSTOMERS jadvali xavfsizligi
DROP POLICY IF EXISTS "customers_insert_check" ON public.customers;
CREATE POLICY "customers_insert_check" ON public.customers
FOR INSERT WITH CHECK (organization_id = public.get_user_org_id());

DROP POLICY IF EXISTS "customers_update_check" ON public.customers;
CREATE POLICY "customers_update_check" ON public.customers
FOR UPDATE USING (organization_id = public.get_user_org_id()) 
WITH CHECK (organization_id = public.get_user_org_id());
