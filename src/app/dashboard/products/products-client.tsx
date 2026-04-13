'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Upload, ImageIcon, Link2, X, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ModalMode = 'add' | 'edit';

const defaultForm = {
    name: '', category: 'Kiyim', price: '', image: '', colors: '', sizes: '', label: '',
};

export default function ProductsClient({ products, orgId }: { products: any[], orgId: string }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatPrice = (val: number) => {
        if (!mounted) return '...';
        return new Intl.NumberFormat('uz-UZ').format(val || 0);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const openAdd = () => {
        setForm(defaultForm);
        setModalMode('add');
        setEditId(null);
        setImagePreview(null);
        setSelectedFile(null);
        setModalOpen(true);
    };

    const openEdit = (p: any) => {
        setForm({
            name: p.name,
            category: p.categories?.name || 'Kiyim',
            price: String(p.price),
            image: p.sku || '',
            colors: p.colors ? p.colors.join(', ') : '',
            sizes: p.sizes ? p.sizes.join(', ') : '',
            label: p.barcode || '',
        });
        setImagePreview(p.sku || null);
        setImageTab(p.sku && p.sku.startsWith('http') ? 'url' : 'upload');
        setModalMode('edit');
        setEditId(p.id);
        setSelectedFile(null);
        setModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!form.name || !form.price || loading) return;
        setLoading(true);

        try {
            let finalImageUrl = form.image;
            if (imageTab === 'upload' && selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('orgId', orgId);

                const uploadRes = await fetch('/api/admin/products/upload', { method: 'POST', body: formData });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalImageUrl = uploadData.url;
                } else {
                    const err = await uploadRes.json();
                    alert(`Xato: ${err.error}`);
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                organization_id: orgId,
                name: form.name,
                price: Number(form.price),
                sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
                colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
                image_url: finalImageUrl || null,
                category: form.category || 'Kiyim',
                label: form.label || null,
            };

            const apiUrl = modalMode === 'add' ? '/api/admin/products' : `/api/admin/products/${editId}`;
            const res = await fetch(apiUrl, {
                method: modalMode === 'add' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setModalOpen(false);
                router.refresh();
            } else {
                alert('Saqlashda xatolik yuz berdi');
            }
        } catch (error) {
            alert('Tarmoq xatosi');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" o'chirilsinmi?`)) return;
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) router.refresh();
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Mahsulotlar</h1>
                    <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-widest">Assortiment boshqaruvi</p>
                </div>
                <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 text-xs shadow-lg">
                    <Plus className="h-3.5 w-3.5" /> Qo'shish
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#111] text-neutral-500 border-b border-neutral-800 text-[9px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="px-5 py-4 text-left">Mahsulot</th>
                                <th className="px-5 py-4 text-left">Turkum</th>
                                <th className="px-5 py-4 text-left">Narxi</th>
                                <th className="px-5 py-4 text-left">Xususiyatlari</th>
                                <th className="px-5 py-4 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-neutral-500 text-xs">Mahsulotlar mavjud emas.</td>
                                </tr>
                            ) : products.map((p) => (
                                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded bg-neutral-800 border border-neutral-700 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                {p.sku ? (
                                                    <img src={p.sku} alt={p.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/111/444?text=X')} />
                                                ) : <ImageIcon className="w-4 h-4 text-neutral-600" />}
                                                {p.barcode && <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-[7px] text-white text-center font-black py-0.5 uppercase truncate">{p.barcode}</span>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm leading-tight">{p.name}</div>
                                                <div className={`text-[8px] mt-0.5 font-black uppercase tracking-widest ${p.is_active ? 'text-emerald-500' : 'text-neutral-500'}`}>{p.is_active ? 'Active' : 'Inactive'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-neutral-400 text-xs">{p.categories?.name || 'Kiyim'}</td>
                                    <td suppressHydrationWarning className="px-5 py-3 font-mono font-bold text-white text-sm">
                                        {formatPrice(p.price)} <span className="text-[10px] text-neutral-500 font-sans">so'm</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {(p.sizes || []).slice(0, 3).map((s: string) => <span key={s} className="bg-neutral-800 text-neutral-400 px-1 py-0.5 rounded text-[8px] font-bold border border-neutral-700">{s}</span>)}
                                        </div>
                                        <div className="text-[9px] text-neutral-500 italic truncate max-w-[100px]">{p.colors?.join(', ')}</div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 hover:bg-red-900/30 text-neutral-400 hover:text-red-500 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && mounted && createPortal(
                <div onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 overflow-y-auto">
                    <div className="bg-[#0f0f0f] border border-neutral-800 w-full max-w-[340px] rounded-2xl shadow-2xl animate-fade-in relative">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-[#0a0a0a] rounded-t-2xl">
                            <h2 className="font-bold text-white text-xs uppercase tracking-widest">{modalMode === 'add' ? 'Yangi mahsulot' : 'Tahrirlash'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">Nomi</label>
                                    <input value={form.name} required onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Masalan: Sport kurtka..."
                                        className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-800 focus:border-blue-700 focus:outline-none transition-all" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">Turkum</label>
                                        <input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="Kiyim..."
                                            className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-800 focus:border-blue-700 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">Label</label>
                                        <input value={form.label} onChange={(e) => setForm({...form, label: e.target.value})} placeholder="Yangi..."
                                            className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-800 focus:border-blue-700 focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">Narxi (so'm)</label>
                                    <input type="number" value={form.price} required onChange={(e) => setForm({...form, price: e.target.value})} placeholder="150000"
                                        className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-xs text-white font-bold placeholder:text-neutral-800" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">Ranglar</label>
                                        <input value={form.colors} onChange={(e) => setForm({...form, colors: e.target.value})} placeholder="Qora, oq..."
                                            className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-neutral-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5 px-0.5">O'lchamlar</label>
                                        <input value={form.sizes} onChange={(e) => setForm({...form, sizes: e.target.value})} placeholder="L, XL, 42..."
                                            className="w-full bg-[#050505] border border-neutral-800/80 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-neutral-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-neutral-900">
                                <div className="flex bg-[#050505] rounded-md p-0.5 mb-3 border border-neutral-900">
                                    <button type="button" onClick={() => setImageTab('upload')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded ${imageTab === 'upload' ? 'bg-neutral-800 text-white' : 'text-neutral-700'}`}>Fayl</button>
                                    <button type="button" onClick={() => setImageTab('url')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded ${imageTab === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-700'}`}>Link</button>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="flex-1">
                                        {imageTab === 'upload' ? (
                                            <label className="flex flex-col items-center justify-center border border-dashed border-neutral-800 bg-[#050505] rounded-lg px-2 py-3 cursor-pointer hover:border-blue-800 transition-all text-neutral-700 active:scale-[0.98]">
                                                <Upload className="h-4 w-4 mb-1" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">{selectedFile ? selectedFile.name.slice(0, 10) + '...' : 'Tanlang'}</span>
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        ) : (
                                            <input value={form.image} onChange={(e) => { setForm({...form, image: e.target.value}); setImagePreview(e.target.value); }} placeholder="https://..."
                                                className="w-full bg-[#050505] border border-neutral-800 rounded-lg px-2.5 py-2 text-[9px] text-white" />
                                        )}
                                    </div>
                                    <div className="w-14 h-14 rounded-lg bg-[#050505] border border-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-neutral-900" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2.5 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-neutral-900 text-neutral-600 px-3 py-2.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest">Bekor qilish</button>
                                <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Saqlash'}
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
