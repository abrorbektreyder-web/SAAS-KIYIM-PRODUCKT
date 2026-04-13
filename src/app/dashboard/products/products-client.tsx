'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Upload, ImageIcon, Link2, X, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ModalMode = 'add' | 'edit';

const defaultForm = {
    name: '', category: 'Kiyim', price: '', image: '', colors: '', sizes: '', label: '',
};

export default function ProductsClient({ products, orgId }: { products: any[], orgId: string }) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('upload');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p || 0);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setForm({ ...form, image: base64 });
            setImagePreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const openAdd = () => {
        setForm(defaultForm);
        setModalMode('add');
        setEditId(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (p: any) => {
        let cat = 'Kiyim';
        let lbl = '';
        try {
            if (p.barcode) {
                const parsed = JSON.parse(p.barcode);
                cat = parsed.category || 'Kiyim';
                lbl = parsed.label || '';
            }
        } catch (e) {
            cat = p.barcode || 'Kiyim';
        }

        setForm({
            name: p.name,
            category: cat,
            price: String(p.price),
            image: p.sku || '',
            colors: p.colors ? p.colors.join(', ') : '',
            sizes: p.sizes ? p.sizes.join(', ') : '',
            label: lbl,
        });
        setImagePreview(p.sku || null);
        setImageTab(p.sku && p.sku.startsWith('http') ? 'url' : 'upload');
        setModalMode('edit');
        setEditId(p.id);
        setModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!form.name || !form.price || loading) return;
        setLoading(true);

        try {
            if (modalMode === 'add') {
                const res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        organization_id: orgId,
                        name: form.name,
                        price: Number(form.price),
                        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
                        colors: form.colors ? form.colors.split(',').map(c => c.trim()) : [],
                        image_url: form.image || null,
                        category: form.category || null,
                        label: form.label || null,
                    })
                });

                if (res.ok) {
                    setModalOpen(false);
                    router.refresh();
                } else {
                    const data = await res.json();
                    alert(data.error || 'Xatolik yuz berdi');
                }
            } else if (editId) {
                const res = await fetch(`/api/admin/products/${editId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        price: Number(form.price),
                        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
                        colors: form.colors ? form.colors.split(',').map(c => c.trim()) : [],
                        image_url: form.image || null,
                        category: form.category || null,
                        label: form.label || null
                    })
                });

                if (res.ok) {
                    setModalOpen(false);
                    router.refresh();
                } else {
                    alert("Tahrirlashda xatolik yuz berdi");
                }
            }
        } catch (error) {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Siz rostdan ham "${name}" ni o'chirmoqchimisiz?`)) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert("O'chirishda xatolik");
            }
        } catch {
            alert("Tarmoq xatosi");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
                    <p className="text-sm text-neutral-500">Do'kon assortimentini boshqarish</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
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
                                <tr className="border-b border-neutral-800 bg-neutral-900/80 text-left text-xs text-neutral-500 uppercase tracking-wider">
                                    <th className="px-5 py-4 font-medium">Mahsulot</th>
                                    <th className="px-5 py-4 font-medium">Turkum & Boshqa</th>
                                    <th className="px-5 py-4 font-medium">Narx</th>
                                    <th className="px-5 py-4 font-medium">O'lcham/Rang</th>
                                    <th className="px-5 py-4 font-medium text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors group">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-neutral-800 border border-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                                    {product.sku ? (
                                                        <img src={product.sku} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-neutral-600" />
                                                    )}
                                                    {(() => {
                                                        let lbl = '';
                                                        try {
                                                            if (product.barcode) {
                                                                const p = JSON.parse(product.barcode);
                                                                lbl = p.label || '';
                                                            }
                                                        } catch (e) {}
                                                        return lbl ? (
                                                            <span className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white text-[8px] text-center font-bold tracking-wider py-0.5 uppercase">{lbl}</span>
                                                        ) : null;
                                                    })()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{product.name}</p>
                                                    <span suppressHydrationWarning className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] ${product.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                                        }`}>
                                                        {product.is_active ? 'Faol' : 'Nofaol'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-neutral-400 text-xs">
                                            <p suppressHydrationWarning>{(() => {
                                                try {
                                                    if (product.barcode) {
                                                        const p = JSON.parse(product.barcode);
                                                        return p.category || '—';
                                                    }
                                                } catch (e) {}
                                                return product.barcode || '—';
                                            })()}</p>
                                        </td>
                                        <td suppressHydrationWarning className="px-5 py-3 font-mono text-white">
                                            {formatPrice(product.price)} so'm
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-wrap gap-1">
                                                    {(product.sizes || []).slice(0, 3).map((s: string) => (
                                                        <span key={s} className="rounded border border-neutral-700 bg-neutral-800/50 px-1.5 py-0.5 text-[10px] text-neutral-300">{s}</span>
                                                    ))}
                                                    {(product.sizes?.length || 0) > 3 && <span className="text-[10px] text-neutral-600">+{product.sizes.length - 3}</span>}
                                                </div>
                                                <div className="text-[10px] text-neutral-500 mt-1">
                                                    {product.colors && product.colors.length > 0 ? product.colors.join(', ') : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(product)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors" title="Tahrirlash">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id, product.name)} className="p-2 bg-neutral-800 hover:bg-red-900/30 hover:text-red-400 text-neutral-500 rounded-lg transition-colors" title="O'chirish">
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

            {isModalOpen && mounted && createPortal(
                <div onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-md p-4 pt-12 animate-fade-in shadow-2xl">
                    <div className="relative w-full max-w-[400px] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl mb-12 transform transition-all scale-100">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4 sticky top-0 bg-neutral-900 z-[10001] rounded-t-2xl">
                            <h2 className="text-sm font-semibold text-white uppercase tracking-widest">
                                {modalMode === 'add' ? 'Yangi mahsulot qo\'shish' : 'Mahsulotni tahrirlash'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        {/* Form */}
                        <div className="px-5 py-6 space-y-5">
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Mahsulot nomi</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Sport kurtka"
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Turkum</label>
                                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Turkum nomi (M-n: Ko'ylak)"
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Narxi (so'm)</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150000"
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Label (ixtiyoriy)</label>
                                    <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Yangi, Trend..."
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Ranglar (vergul)</label>
                                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Qora, Oq"
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">O'lchamlar (vergul)</label>
                                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL"
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                                </div>
                            </div>

                            {/* Rasm yuklash qismi */}
                            <div className="pt-2">
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Mahsulot rasmi</label>
                                <div className="flex rounded-xl overflow-hidden border border-neutral-700 mb-3 bg-neutral-950 p-1">
                                    <button type="button" onClick={() => setImageTab('upload')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${imageTab === 'upload' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                                            }`}>
                                        <Upload className="h-3.5 w-3.5" /> Fayl
                                    </button>
                                    <button type="button" onClick={() => setImageTab('url')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${imageTab === 'url' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                                            }`}>
                                        <Link2 className="h-3.5 w-3.5" /> URL
                                    </button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        {imageTab === 'upload' ? (
                                            <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-950 px-4 py-4 cursor-pointer hover:border-neutral-500 hover:bg-neutral-900 transition-all group">
                                                <Upload className="h-5 w-5 text-neutral-500 group-hover:text-white transition-colors" />
                                                <span className="text-xs text-neutral-500 font-medium group-hover:text-neutral-200">Faylni tanlang</span>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        ) : (
                                            <input value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }} placeholder="https://sayt.uz/rasm.jpg"
                                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all shadow-inner" />
                                        )}
                                    </div>
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 flex-shrink-0 flex items-center justify-center shadow-lg">
                                        {(imagePreview || form.image) ? (
                                            <img src={imagePreview || form.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-neutral-800" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 pt-6 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={() => handleSave()}
                                    disabled={loading || !form.name || !form.price}
                                    className="flex-[2] rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:hover:shadow-none"
                                >
                                    {loading ? '⏳ Saqlanmoqda...' : (modalMode === 'add' ? '💾 Mahsulotni qo\'shish' : '✏️ O\'zgarishlarni saqlash')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
