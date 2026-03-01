'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersClient({ customers, orgId }: { customers: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ full_name: '', phone: '' });

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p || 0);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization_id: orgId,
                    full_name: form.full_name,
                    phone: form.phone
                })
            });
            if (res.ok) {
                setForm({ full_name: '', phone: '' });
                setModalOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mijozlar</h1>
                    <p className="text-sm text-neutral-500">Doimiy xaridorlar ro'yxati</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
                >
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-12 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl mb-12">
                        <h2 className="mb-4 text-lg font-bold text-white">Yangi mijoz qo'shish</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Toliq ism</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="Masalan: Sardor Aliyev"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Telefon raqam</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="+998901234567"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg px-4 py-2 font-medium text-neutral-400 hover:text-white"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-white px-4 py-2 font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50"
                                >
                                    {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
