import { createServerSupabaseClient } from './supabase/server';

// ═══════════════════════════════════════
// Supabase dan real ma'lumotlarni olish
// ═══════════════════════════════════════

export async function getOrgProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role, full_name, store_id')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function getStores(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getProducts(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getOrders(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('orders')
    .select('*, customers(full_name, phone)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getCustomers(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getCategories(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('organization_id', orgId)
    .order('sort_order');
  return data || [];
}

export async function getInventory(storeId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('inventory')
    .select('*, products(name, price, sku)')
    .eq('store_id', storeId);
  return data || [];
}

// ═══════════════════════════════════════
// Yordamchi funksiyalar
// ═══════════════════════════════════════

export function formatPrice(amount: number): string {
  if (amount == null) return '0';
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' mln';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + ' ming';
  return amount.toLocaleString();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
}
