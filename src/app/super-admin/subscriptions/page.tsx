'use client';

import { useState, useEffect } from 'react';
import { ShieldBan, ShieldCheck, CalendarClock, CreditCard } from 'lucide-react';

const PLAN_PRICES: Record<string, number> = {
    starter: 150000,
    business: 300000,
    premium: 500000,
};

type Organization = {
    id: string;
    name: string;
    slug: string;
    plan: string;
    subscription_status: string;
    subscription_ends_at: string | null;
    created_at: string;
};

export default function SuperAdminSubscriptions() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/organizations');
            const data = await res.json();
            if (data.organizations) {
                setOrganizations(data.organizations);
            }
        } catch (e) {
            console.error("Failed to load", e);
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, subscription_status: newStatus })
            });
            if (res.ok) {
                fetchOrgs();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const formatPrice = (price?: number) => {
        if (!price) return '0 so\'m';
        return price.toLocaleString('ru-RU') + ' so\'m';
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Noma\'lum';
        return new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getPaidDate = (endsAtStr: string | null, status: string, createdAt: string) => {
        if (status === 'trialing' || status === 'trial') return 'Sinov muddati';
        if (!endsAtStr) return formatDate(createdAt); // Yangi faol bo'lsa

        // Agar tugash muddati bo'lsa, odatda 1 oy oldin to'langan deymiz
        const endsDate = new Date(endsAtStr);
        endsDate.setMonth(endsDate.getMonth() - 1);
        return formatDate(endsDate.toISOString());
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Obunalar boshqaruvi</h1>
                    <p className="text-sm text-neutral-400 mt-1">Barcha to'lovlar, muddatlar va tariflar holati</p>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-800/50 text-xs uppercase text-neutral-500 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Do'kon nomi</th>
                                <th className="px-6 py-4 font-medium">Tarif / Oylik to'lov</th>
                                <th className="px-6 py-4 font-medium">Holat</th>
                                <th className="px-6 py-4 font-medium">So'nggi to'lov</th>
                                <th className="px-6 py-4 font-medium">Keyingi to'lov muddati</th>
                                <th className="px-6 py-4 font-medium text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin mb-4"></div>
                                            <p className="text-neutral-500">Yuklanmoqda...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center flex flex-col items-center justify-center">
                                        <CreditCard className="w-12 h-12 text-neutral-700 mb-4" />
                                        <p className="text-neutral-500">Tashkilotlar mavjud emas.</p>
                                    </td>
                                </tr>
                            ) : organizations.map((org) => {
                                const price = PLAN_PRICES[org.plan?.toLowerCase() || 'starter'];
                                return (
                                    <tr key={org.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{org.name}</div>
                                            <div className="text-xs text-neutral-500 mt-1">/{org.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="uppercase text-xs font-bold text-neutral-300">{org.plan}</div>
                                            <div className="text-xs text-neutral-500 mt-1">{formatPrice(price)}/oy</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${org.subscription_status === 'blocked' ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                                                    : org.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                                                }`}>
                                                {org.subscription_status === 'active' ? 'Faol'
                                                    : org.subscription_status === 'blocked' ? 'Bloklangan'
                                                        : 'Sinov (/trial)'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {getPaidDate(org.subscription_ends_at, org.subscription_status, org.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <div className="flex items-center gap-2">
                                                <CalendarClock className={`w-4 h-4 ${org.subscription_status === 'blocked' ? 'text-red-500' : 'text-emerald-500'}`} />
                                                <span className={org.subscription_status === 'blocked' ? 'text-red-400' : ''}>
                                                    {org.subscription_status === 'trialing' || org.subscription_status === 'trial' ? 'Sinovda' : formatDate(org.subscription_ends_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleStatus(org.id, org.subscription_status)}
                                                title={org.subscription_status === 'blocked' ? 'Blokni yechish' : 'Bloklash'}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${org.subscription_status === 'blocked'
                                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                                    }`}
                                            >
                                                {org.subscription_status === 'blocked' ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />}
                                                {org.subscription_status === 'blocked' ? 'Faollashtirish' : 'Bloklash'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
