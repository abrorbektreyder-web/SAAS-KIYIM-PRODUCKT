'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Package, TrendingUp, Upload, ImageIcon, Link2 } from 'lucide-react';
import { useProducts } from '@/lib/product-context';
import { storeCategories, formatStorePrice, type StoreProduct } from '@/lib/store-data';
import { useRouter } from 'next/navigation';

type ModalMode = 'add' | 'edit';

const defaultForm = {
    name: '', category: 'Ko\'ylak', price: '', image: '', colors: '', sizes: '', label: '',
};

export default function StoreProductsPage() {
    const { products, totalProducts, totalValue } = useProducts();
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [success, setSuccess] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('upload');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        setModalOpen(true);
    };

    const openEdit = (p: StoreProduct) => {
        setForm({
            name: p.name,
            category: p.category,
            price: String(p.price),
            image: p.image,
            colors: '',
            sizes: '',
            label: p.label || '',
        });
        setModalMode('edit');
        setEditId(p.id);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price || loading) return;
        setLoading(true);

        try {
            if (modalMode === 'add') {
                // API orqali database ga qo'shish
                const res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        organization_id: 'auto', // Server o'zi aniqlaydi
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
                    showSuccess(`"${form.name}" qo'shildi!`);
                    // Sahifani yangilash — serverdan yangi ma'lumotlarni olish
                    window.location.reload();
                } else {
                    const data = await res.json();
                    alert(data.error || "Xatolik yuz berdi");
                }
            } else if (editId) {
                // Tahrirlash
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
                    showSuccess(`"${form.name}" yangilandi!`);
                    window.location.reload();
                } else {
                    alert("Tahrirlashda xatolik yuz berdi");
                }
            }
        } catch (e) {
            alert("Tarmoq xatosi");
        }

        setLoading(false);
        setModalOpen(false);
    };

    const handleDelete = async (id: string, name: string) => {
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showSuccess(`"${name}" o'chirildi!`);
                window.location.reload();
            } else {
                alert("O'chirishda xatolik");
            }
        } catch {
            alert("Tarmoq xatosi");
        }
    };

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const filtered = filterCat ? products.filter((p) => p.category === filterCat) : products;

    // Kategoriya bo'yicha hisoblash
    const catCounts: Record<string, number> = {};
    products.forEach((p) => {
        catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mahsulotlar boshqaruvi</h1>
                    <p className="text-sm text-neutral-500">Real vaqtda tovar qoldiq va narxlarni boshqarish</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Yangi mahsulot
                </button>
            </div>

            {/* KPI kartalar */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                        <Package className="h-4 w-4" />
                        <span className="text-xs">Jami mahsulotlar</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalProducts}</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Jami qiymat</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatStorePrice(totalValue)}</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                        <span className="text-xs">Turkumlar</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{Object.keys(catCounts).length}</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                        <span className="text-xs">O'rtacha narx</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalProducts > 0 ? formatStorePrice(Math.round(totalValue / totalProducts)) : '0'}</p>
                </div>
            </div>

            {success && (
                <div className="rounded-lg border border-green-800/40 bg-green-900/20 px-4 py-3 text-sm text-green-400 animate-fade-in">✅ {success}</div>
            )}

            {/* Kategoriya filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setFilterCat('')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${!filterCat ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                    Barchasi ({totalProducts})
                </button>
                {Object.entries(catCounts).map(([cat, count]) => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCat === cat ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                        {cat} ({count})
                    </button>
                ))}
            </div>

            {/* Mahsulotlar ro'yxati */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                    <div key={p.id} className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all hover:border-neutral-700">
                        <div className="relative aspect-square overflow-hidden bg-neutral-100">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" unoptimized />
                            {p.label && (
                                <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">{p.label}</span>
                            )}
                            {/* Amallar — hover da */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(p)} className="rounded-lg bg-white/90 p-2 text-black hover:bg-white transition-colors">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(p.id, p.name)} className="rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-medium text-white truncate">{p.name}</p>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-xs text-neutral-500">{p.category}</span>
                                <span className="text-sm font-bold text-white">{formatStorePrice(p.price)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="flex items-center justify-center py-16">
                    <p className="text-neutral-500">Bu turkumda mahsulot yo'q</p>
                </div>
            )}

            {/* MODAL — Yangi/Tahrirlash */}
            {modalOpen && (
                <div onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 pt-12 animate-fade-in">
                    <div className="relative w-full max-w-[380px] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl mb-12">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5 sticky top-0 bg-neutral-900 z-10">
                            <h2 className="text-sm font-semibold text-white">
                                {modalMode === 'add' ? 'Yangi mahsulot qo\'shish' : 'Mahsulotni tahrirlash'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        {/* Form */}
                        <div className="px-5 py-4 space-y-3.5">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Mahsulot nomi</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Sport kurtka"
                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-neutral-400">Turkum</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none transition-colors">
                                    {storeCategories.filter(c => c !== 'Barchasi').map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">Narx (so'm)</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150000"
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">Label (ixtiyoriy)</label>
                                    <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Yangi, Trend..."
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">Ranglar (vergul)</label>
                                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Qora, Oq"
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-neutral-400">O'lchamlar (vergul)</label>
                                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL"
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                                </div>
                            </div>

                            {/* Rasm yuklash */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-neutral-400">Mahsulot rasmi</label>
                                {/* Tab tanlash */}
                                <div className="flex rounded-lg overflow-hidden border border-neutral-700 mb-2.5">
                                    <button type="button" onClick={() => setImageTab('upload')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${imageTab === 'upload' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                            }`}>
                                        <Upload className="h-3 w-3" /> Kompyuterdan
                                    </button>
                                    <button type="button" onClick={() => setImageTab('url')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${imageTab === 'url' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                            }`}>
                                        <Link2 className="h-3 w-3" /> URL orqali
                                    </button>
                                </div>
                                {/* Tab content */}
                                <div className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        {imageTab === 'upload' ? (
                                            <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-600 bg-neutral-800/50 px-3 py-3 cursor-pointer hover:border-neutral-400 transition-colors">
                                                <Upload className="h-4 w-4 text-neutral-500" />
                                                <span className="text-xs text-neutral-400">Rasmni tanlang</span>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        ) : (
                                            <input value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }} placeholder="https://rasm-manzili.jpg"
                                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                                        )}
                                    </div>
                                    {/* Preview */}
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0 flex items-center justify-center">
                                        {(imagePreview || form.image) ? (
                                            <img src={imagePreview || form.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-5 w-5 text-neutral-600" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tugmalar */}
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleSave} disabled={!form.name || !form.price || loading}
                                    className="flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed">
                                    {loading ? '⏳ Saqlanmoqda...' : modalMode === 'add' ? '💾 Saqlash' : '✏️ Yangilash'}
                                </button>
                                {modalMode === 'edit' && editId && (
                                    <button onClick={() => { handleDelete(editId, form.name); setModalOpen(false); }}
                                        className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-900/40 transition-colors">
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
