import { getCustomers, getOrgProfile, formatPrice, formatDate } from '@/lib/data';
import { Plus, Search } from 'lucide-react';

export default async function CustomersPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const customers = await getCustomers(profile.organization_id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mijozlar</h1>
                    <p className="text-sm text-neutral-500">Doimiy xaridorlar ro'yxati</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Mijoz qo'shish
                </button>
            </div>

            {customers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Mijozlar hali mavjud emas.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3.5 font-medium">Mijoz</th>
                                    <th className="px-5 py-3.5 font-medium">Telefon</th>
                                    <th className="px-5 py-3.5 font-medium">Buyurtmalar</th>
                                    <th className="px-5 py-3.5 font-medium">Jami xarid</th>
                                    <th className="px-5 py-3.5 font-medium">Daraja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {customers.map((c: any) => {
                                    const tierStyle = c.tier === 'vip'
                                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                        : c.tier === 'regular'
                                            ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
                                            : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20';
                                    const tierLabel = c.tier === 'vip' ? 'VIP' : c.tier === 'regular' ? 'Doimiy' : 'Yangi';
                                    return (
                                        <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-white">
                                                        {c.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '?'}
                                                    </div>
                                                    <span className="font-medium text-white">{c.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-400">{c.phone}</td>
                                            <td className="px-5 py-4 text-white font-medium">{c.total_orders || 0}</td>
                                            <td className="px-5 py-4 text-white font-medium">{formatPrice(c.total_purchases || 0)} so'm</td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs ${tierStyle}`}>{tierLabel}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
