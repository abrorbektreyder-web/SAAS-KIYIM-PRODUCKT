'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersClient({ customers, orgId }: { customers: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ full_name: '', phone: '', tier: 'new' });

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p || 0);

    const openAdd = () => {
        setModalMode('add');
        setEditId(null);
        setForm({ full_name: '', phone: '', tier: 'new' });
        setModalOpen(true);
    };

    const openEdit = (c: any) => {
        setModalMode('edit');
        setEditId(c.id);
        setForm({ full_name: c.full_name, phone: c.phone, tier: c.tier || 'new' });
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = modalMode === 'add' ? '/api/admin/customers' : `/api/admin/customers/${editId}`;
            const method = modalMode === 'add' ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization_id: orgId,
                    full_name: form.full_name,
                    phone: form.phone,
                    tier: form.tier,
                }),
            });

            if (res.ok) {
                setModalOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" ismli mijozni o'chirmoqchimisiz?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "O'chirishda xatolik");
            }
        } catch {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mijozlar</h1>
                    <p className="text-sm text-neutral-500">Doimiy xaridorlar ro&apos;yxati</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200 shadow-lg shadow-white/5 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Mijoz qo&apos;shish
                </button>
            </div>

            {/* Empty state */}
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
                                    <th className="px-5 py-3.5 font-medium text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {customers.map((c: any) => {
                                    const tierStyle =
                                        c.tier === 'vip'
                                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                            : c.tier === 'regular'
                                            ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
                                            : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20';
                                    const tierLabel =
                                        c.tier === 'vip' ? 'VIP' : c.tier === 'regular' ? 'Doimiy' : 'Yangi';

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
                                            <td className="px-5 py-4 text-white font-medium" suppressHydrationWarning>
                                                {formatPrice(c.total_purchases || 0)} so&apos;m
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tierStyle}`}>
                                                    {tierLabel}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(c)}
                                                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-all"
                                                        title="Tahrirlash"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id, c.full_name)}
                                                        className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Portal Modal */}
            {isModalOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    {/* Backdrop click */}
                    <div className="fixed inset-0" onClick={() => setModalOpen(false)} />

                    {/* Modal card */}
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
                        {/* Title row */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {modalMode === 'add' ? "Yangi mijoz qo'shish" : 'Mijozni tahrirlash'}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    To&apos;liq ism
                                </label>
                                <input
                                    required
                                    type="text"
                                    autoFocus
                                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder:text-neutral-700"
                                    placeholder="Masalan: Sardor Aliyev"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Telefon raqam
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder:text-neutral-700"
                                    placeholder="+998901234567"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>

                            {modalMode === 'edit' && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Mijoz darajasi
                                    </label>
                                    <select
                                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                                        value={form.tier}
                                        onChange={(e) => setForm({ ...form, tier: e.target.value })}
                                    >
                                        <option value="new">Yangi (New)</option>
                                        <option value="regular">Doimiy (Regular)</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-neutral-200 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
