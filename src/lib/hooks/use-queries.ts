'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Query Keys (kesh kalitlari) ────────────────────────────
export const queryKeys = {
    orders:       (orgId: string) => ['orders', orgId] as const,
    orderKpis:    (orgId: string) => ['order-kpis', orgId] as const,
    organizations: ()             => ['organizations'] as const,
    stores:       (orgId: string) => ['stores', orgId] as const,
    customers:    (orgId: string) => ['customers', orgId] as const,
};

// ─── Yordamchi fetch funksiya ────────────────────────────────
async function apiFetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

// ─── Hooks ──────────────────────────────────────────────────

/** Buyurtmalar — 5 daqiqa kesh */
export function useOrders(orgId: string) {
    return useQuery({
        queryKey: queryKeys.orders(orgId),
        queryFn: () => apiFetch<any[]>(`/api/admin/orders?orgId=${orgId}&limit=50`),
        enabled: !!orgId,
    });
}

/** Dashboard KPI — 5 daqiqa kesh */
export function useOrderKpis(orgId: string) {
    return useQuery({
        queryKey: queryKeys.orderKpis(orgId),
        queryFn: () => apiFetch<any>(`/api/admin/kpis?orgId=${orgId}`),
        enabled: !!orgId,
    });
}

/** Tashkilotlar ro'yxati (Super Admin) — 5 daqiqa kesh */
export function useOrganizations() {
    return useQuery({
        queryKey: queryKeys.organizations(),
        queryFn: () => apiFetch<any[]>('/api/admin/organizations'),
    });
}

/** Do'konlar ro'yxati — 5 daqiqa kesh */
export function useStores(orgId: string) {
    return useQuery({
        queryKey: queryKeys.stores(orgId),
        queryFn: () => apiFetch<any[]>(`/api/admin/stores?orgId=${orgId}`),
        enabled: !!orgId,
    });
}

/** Mijozlar — 5 daqiqa kesh */
export function useCustomers(orgId: string) {
    return useQuery({
        queryKey: queryKeys.customers(orgId),
        queryFn: () => apiFetch<any[]>(`/api/admin/customers?orgId=${orgId}`),
        enabled: !!orgId,
    });
}
