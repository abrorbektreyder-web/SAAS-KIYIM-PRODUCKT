'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Copy, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffClient({ staff, stores, orgId }: { staff: any[], stores: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        password: '',
        store_id: stores[0]?.id || ''
    });
    const [copied, setCopied] = useState(false);
    const [siteUrl, setSiteUrl] = useState('https://kassa.vercel.app'); // Faqat fallback uchun

    // Mijozning haqiqiy sayt manzilini aniqlash (localhost yoki vercel)
    useEffect(() => {
        setSiteUrl(window.location.origin);
    }, []);

    // Auto generate login
    const generatedLogin = useMemo(() => {
        const selectedStore = stores.find(s => s.id === form.store_id);
        const storePart = (selectedStore?.name || 'dokon').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const namePart = (form.full_name || 'kassir').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return `${storePart}_${namePart}@hoyr.uz`;
    }, [form.store_id, form.full_name, stores]);

    const handleCopy = () => {
        const text = `Salom! Siz do'konga kassir etib tayinlandingiz.

🏪 Dasturga kirish manzili: ${siteUrl}/login
👤 Login: ${generatedLogin}
🔑 Parol: ${form.password || '[Parol yozilmagan]'}

Uzoq ishlashimiz nasib qilsin!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization_id: orgId,
                    email: generatedLogin,
                    password: form.password,
                    full_name: form.full_name,
                    role: 'cashier',
                    store_id: form.store_id
                })
            });
            if (res.ok) {
                setForm({ full_name: '', password: '', store_id: stores[0]?.id || '' });
                setModalOpen(false);
                window.location.reload(); // qatiy yangilash
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
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Avtomatik Login (Tizim o'zi yasadi)</label>
                                <div className="relative">
                                    <input
                                        readOnly
                                        type="text"
                                        className="w-full rounded-lg border border-neutral-800 bg-indigo-900/10 px-3 py-2 text-sm text-indigo-300 focus:outline-none transition-all"
                                        value={generatedLogin}
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <span className="text-[10px] text-indigo-400/70 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Avtomat</span>
                                    </div>
                                </div>
                                <p className="mt-1.5 text-[11px] text-neutral-500">Bu login kassirga faqat uning do'koniga kirishga ruxsat beradi.</p>
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

                            {/* Tayyor link va Nusxalash */}
                            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mt-2">
                                <div className="mb-3">
                                    <label className="mb-1 block text-xs font-medium text-indigo-300">Dasturga kirish manzili (Sizning do'koniz uchun maxsus)</label>
                                    <div className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-900/20 px-3 py-2">
                                        <LinkIcon className="h-4 w-4 text-indigo-400" />
                                        <input
                                            readOnly
                                            type="text"
                                            className="w-full bg-transparent text-sm text-indigo-200 focus:outline-none"
                                            value={`${siteUrl}/login`}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${copied
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Nusxalandi!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Kassir uchun barchasini nusxalash
                                        </>
                                    )}
                                </button>
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
