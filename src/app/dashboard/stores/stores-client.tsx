'use client';

import { useState } from 'react';
import { Plus, MapPin, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StoresClient({ initialStores, orgId }: { initialStores: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        address: '',
        city: '',
        phone: ''
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, organization_id: orgId })
            });
            if (res.ok) {
                setForm({ name: '', address: '', city: '', phone: '' });
                setModalOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Qo\'shishda xatolik yuz berdi');
            }
        } catch (error) {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Do'konlar (Filiallar)</h1>
                        <p className="text-sm text-neutral-500">Barcha filiallarni boshqarish</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
                    >
                        <Plus className="h-4 w-4" />
                        Yangi filial
                    </button>
                </div>

                {initialStores.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center flex flex-col items-center justify-center">
                        <Store className="h-10 w-10 text-neutral-600 mb-3" />
                        <p className="text-neutral-400 font-medium">Hali filiallar qo'shilmagan.</p>
                        <p className="text-neutral-500 text-sm mt-1">Siz xodimlar qo'shishingiz va savdo qilishingiz uchun avval filialingiz (do'koningiz) ni hududini ro'yxatdan o'tkazishingiz zarur.</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="mt-6 flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-sm shadow-black/50 hover:shadow-black"
                        >
                            Yangi filial qo'shish
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                        {initialStores.map((store: any) => (
                            <div key={store.id} className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-base font-semibold text-white">{store.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3 text-neutral-500" />
                                            <span className="text-xs text-neutral-500">{store.address || store.city || 'Manzil belgilanmagan'}</span>
                                        </div>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${store.is_active
                                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                        : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                        }`}>
                                        {store.is_active ? 'Faol' : 'Nofaol'}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-800">
                                    <span className="text-xs text-neutral-500">{store.phone || 'Tel. belgilanmagan'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-12 backdrop-blur-sm shadow-2xl">
                    <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl animate-fade-in custom-modal mb-12">
                        <h2 className="mb-4 text-lg font-bold text-white">Yangi filial qo'shish</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Do'kon/Filial nomi</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="Masalan: Chilonzor filiali"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">Shahar</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                        placeholder="Masalan: Toshkent"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">Telefon raqam</label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                        placeholder="+998 90 123 45 67"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">To'liq manzil</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="Oqat-tepa maydoni 15-uy"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
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
                                    {loading ? "Saqlanmoqda..." : "Tasdiqlash va qo'shish"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
