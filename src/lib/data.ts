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

export async function getOrganization(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();
  return data;
}

export async function getStores(orgId: string, page: number = 1, pageSize: number = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('stores')
    .select('*', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .range(from, to);
  return { stores: data || [], totalCount: count || 0 };
}

export async function getProducts(orgId: string, page: number = 1, pageSize: number = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .range(from, to);

  return { products: data || [], totalCount: count || 0 };
}

export async function getStoreProducts(orgId: string, storeId: string, page: number = 1, pageSize: number = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('products')
    .select('*, categories(name), inventory(stock)', { count: 'exact' })
    .eq('organization_id', orgId)
    .eq('is_active', true)
    .range(from, to);

  // inventory dan faqat shu store_id ga tegishli qoldiqni olamiz
  if (!data) return { products: [], totalCount: 0 };

  // Har bir mahsulot uchun shu do'konning inventorysi bo'lsa ko'rsatamiz
  const filteredData = data.filter((p: any) => {
    // Agar inventory bor bo'lsa — shu do'konning inventorysini tekshiramiz
    if (p.inventory && p.inventory.length > 0) return true;
    // Inventorysiz ham ko'rsatamiz
    return true;
  });

  return { products: filteredData, totalCount: count || 0 };
}

export async function getOrders(orgId: string, page: number = 1, pageSize: number = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('orders')
    .select('*, customers(full_name, phone)', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .range(from, to);
  return { orders: data || [], totalCount: count || 0 };
}

export async function getOrderKPIs(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .rpc('get_order_kpis', { p_org_id: orgId });

  if (error) {
    console.error("RPC Error (getOrderKPIs):", error);
    return { total_revenue: 0, total_orders: 0 };
  }
  return data as { total_revenue: number, total_orders: number };
}

export async function getCustomers(orgId: string, page: number = 1, pageSize: number = 20) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .range(from, to);
  return { customers: data || [], totalCount: count || 0 };
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
