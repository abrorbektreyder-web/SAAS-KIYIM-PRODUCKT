'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, X, ImageIcon, Upload, Link2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

// formatPrice - server importisiz, ichkarida aniqlaymiz
function formatPrice(amount: number): string {
    if (amount == null) return '0';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' mln';
    if (amount >= 1000) return (amount / 1000).toFixed(0) + ' ming';
    return amount.toLocaleString();
}

const defaultForm = {
    name: '',
    price: '',
    image: '',
    is_active: true,
};

export default function InventoryClient({ products }: { products: any[] }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setForm(prev => ({ ...prev, image: base64 }));
            setImagePreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const openEdit = (p: any) => {
        setForm({
            name: p.name,
            price: String(p.price),
            image: p.sku || '',
            is_active: p.is_active,
        });
        setImagePreview(p.sku || null);
        setImageTab(p.sku && p.sku.startsWith('http') ? 'url' : 'upload');
        setEditId(p.id);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price || loading || !editId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${editId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    price: Number(form.price),
                    image_url: form.image || null,
                    is_active: form.is_active,
                }),
            });
            if (res.ok) {
                setModalOpen(false);
                router.refresh();
            } else {
                alert('Xatolik yuz berdi');
            }
        } catch {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" mahsulotini o'chirasizmi?`)) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert("O'chirishda xatolik");
            }
        } catch {
            alert('Tarmoq xatosi');
        }
    };

    return (
        <>
            {products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Mahsulotlar hali mavjud emas.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3.5 font-medium">Mahsulot</th>
                                    <th className="px-5 py-3.5 font-medium">Turkum</th>
                                    <th className="px-5 py-3.5 font-medium">Narx</th>
                                    <th className="px-5 py-3.5 font-medium">Holat</th>
                                    <th className="px-5 py-3.5 font-medium text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {products.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors group">
                                        <td className="px-5 py-4 font-medium text-white">{p.name}</td>
                                        <td className="px-5 py-4 text-neutral-400">{p.categories?.name || '—'}</td>
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-300">
                                            {formatPrice(p.price)} so'm
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${
                                                p.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                    : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                            }`}>
                                                {p.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors"
                                                    title="Tahrirlash"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id, p.name)}
                                                    className="p-2 bg-neutral-800 hover:bg-red-900/40 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && mounted && createPortal(
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
                >
                    <div className="relative w-full max-w-[400px] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
                            <h2 className="text-sm font-semibold text-white uppercase tracking-widest">
                                Mahsulotni tahrirlash
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="px-5 py-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                    Mahsulot nomi
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all"
                                />
                            </div>

                            {/* Price & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                        Narxi (so'm)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                        Holat
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                        className={`w-full rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            form.is_active
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${form.is_active ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                                        {form.is_active ? 'Faol' : 'Nofaol'}
                                    </button>
                                </div>
                            </div>

                            {/* Image */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                    Rasm
                                </label>
                                <div className="flex rounded-xl overflow-hidden border border-neutral-700 mb-3 bg-neutral-950 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setImageTab('upload')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                            imageTab === 'upload' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                    >
                                        <Upload className="h-3.5 w-3.5" /> Fayl
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageTab('url')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                            imageTab === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                    >
                                        <Link2 className="h-3.5 w-3.5" /> URL
                                    </button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        {imageTab === 'upload' ? (
                                            <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-950 px-4 py-4 cursor-pointer hover:border-neutral-500 transition-all">
                                                <Upload className="h-5 w-5 text-neutral-500" />
                                                <span className="text-xs text-neutral-500">Faylni tanlang</span>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        ) : (
                                            <input
                                                value={form.image}
                                                onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }}
                                                placeholder="https://sayt.uz/rasm.jpg"
                                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all"
                                            />
                                        )}
                                    </div>
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 flex-shrink-0 flex items-center justify-center">
                                        {(imagePreview || form.image) ? (
                                            <img src={imagePreview || form.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-neutral-700" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading || !form.name || !form.price}
                                    className="flex-[2] rounded-xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-neutral-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                                >
                                    {loading ? '⏳ Saqlanmoqda...' : (
                                        <><Save className="w-4 h-4" /> O'zgarishlarni saqlash</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
