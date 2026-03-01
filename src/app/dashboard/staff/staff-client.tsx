'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffClient({ staff, stores, orgId }: { staff: any[], stores: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        store_id: stores[0]?.id || ''
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization_id: orgId,
                    email: form.email,
                    password: form.password,
                    full_name: form.full_name,
                    role: 'cashier',
                    store_id: form.store_id
                })
            });
            if (res.ok) {
                setForm({ full_name: '', email: '', password: '', store_id: stores[0]?.id || '' });
                setModalOpen(false);
                router.refresh(); // sahifani yangilash
            } else {
                const data = await res.json();
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Haqiqatdan ham ushbu xodimni butunlay o'chirmoqchimisiz?")) return;

        try {
            const res = await fetch(`/api/admin/staff?userId=${userId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "O'chirishda xatolik yuz berdi");
            }
        } catch (error) {
            alert("Tarmoq xatosi");
        }
    };


    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Xodimlar</h1>
                        <p className="text-sm text-neutral-500">Do'koningiz kassirlarini boshqarish</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
                    >
                        <Plus className="h-4 w-4" />
                        Kassir qo'shish
                    </button>
                </div>

                {staff.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                        <p className="text-neutral-500 text-sm">Hali birorta ham kassir qo'shilmagan.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                        <th className="px-5 py-3.5 font-medium">To'liq ism</th>
                                        <th className="px-5 py-3.5 font-medium">Do'kon (Filial)</th>
                                        <th className="px-5 py-3.5 font-medium">Roli</th>
                                        <th className="px-5 py-3.5 font-medium text-right">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {staff.map((employee: any) => (
                                        <tr key={employee.id} className="hover:bg-neutral-800/40 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-white">
                                                        {employee.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'K'}
                                                    </div>
                                                    <span className="font-medium text-white">{employee.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-400">
                                                {employee.stores?.name || 'Biriktirilmagan'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                                                    Kassir
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-12 backdrop-blur-sm shadow-2xl">
                    <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl animate-fade-in custom-modal mb-12">
                        <h2 className="mb-4 text-lg font-bold text-white">Yangi kassir qo'shish</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">To'liq ism</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="Masalan: Anvar Toshmatov"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Email (Login uchun)</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="kassir@namuna.uz"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Parol</label>
                                <input
                                    required
                                    type="password"
                                    minLength={6}
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="Eng kamida 6ta belgi"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Filialni tanlang</label>
                                <select
                                    required
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    value={form.store_id}
                                    onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                                >
                                    <option value="" disabled>Filial tanlang</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg px-4 py-2 font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-white px-4 py-2 font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50"
                                >
                                    {loading ? "Qo'shilmoqda..." : "Tasdiqlash"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
