'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsClient({ products, orgId }: { products: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', price: '' });

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p || 0);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization_id: orgId,
                    name: form.name,
                    price: Number(form.price),
                    sizes: [],
                    colors: []
                })
            });
            if (res.ok) {
                setForm({ name: '', price: '' });
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
                    <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
                    <p className="text-sm text-neutral-500">Do'kon assortimentini boshqarish</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
                >
                    <Plus className="h-4 w-4" />
                    Mahsulot qo'shish
                </button>
            </div>

            {products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Hali mahsulotlar qo'shilmagan.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/80 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3.5 font-medium">Mahsulot nomi</th>
                                    <th className="px-5 py-3.5 font-medium">Turkum</th>
                                    <th className="px-5 py-3.5 font-medium">Narx</th>
                                    <th className="px-5 py-3.5 font-medium">O'lchamlar</th>
                                    <th className="px-5 py-3.5 font-medium">Holat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">
                                                    {product.colors?.join(', ') || '—'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-neutral-400">
                                            {product.categories?.name || '—'}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-white">
                                            {formatPrice(product.price)} so'm
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(product.sizes || []).slice(0, 3).map((s: string) => (
                                                    <span key={s} className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400">{s}</span>
                                                ))}
                                                {(product.sizes?.length || 0) > 3 && <span className="text-xs text-neutral-600">+{product.sizes.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${product.is_active
                                                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                                }`}>
                                                {product.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-12 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl mb-12">
                        <h2 className="mb-4 text-lg font-bold text-white">Yangi mahsulot</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Mahsulot nomi</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="Masalan: Qishki kurtka"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Narxi (so'm)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="250000"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
