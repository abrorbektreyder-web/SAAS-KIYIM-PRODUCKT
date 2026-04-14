'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus, Upload, ImageIcon, Link2, X, Pencil, Trash2, Loader2,
    Package, Tag, Palette, Ruler, Layers, ChevronRight, AlertCircle,
    CheckCircle2, ArrowRight, Grid3X3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────

type ModalMode = 'add' | 'edit';

interface VariantCell {
    color: string;
    size:  string;
    stock: number;
}

interface ProductForm {
    name:     string;
    category: string;
    price:    string;
    image:    string;
    colors:   string; // comma-separated
    sizes:    string; // comma-separated
    label:    string;
}

interface Product {
    id:          string;
    name:        string;
    price:       number;
    sku:         string | null;
    barcode:     string | null;
    is_active:   boolean;
    colors:      string[];
    sizes:       string[];
    categories?: { name: string };
}

// ─── Defaults ──────────────────────────────────────────────────────────────

const defaultForm: ProductForm = {
    name: '', category: 'Kiyim', price: '', image: '', colors: '', sizes: '', label: '',
};

// ─── Helper: parse comma-separated string ──────────────────────────────────

function parseList(str: string): string[] {
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

// ─── Helper: build cartesian product (colors × sizes) ─────────────────────

function buildVariantGrid(colors: string[], sizes: string[]): VariantCell[] {
    if (colors.length === 0 && sizes.length === 0) return [];
    if (colors.length === 0) return sizes.map(s => ({ color: '', size: s, stock: 0 }));
    if (sizes.length === 0) return colors.map(c => ({ color: c, size: '', stock: 0 }));
    const grid: VariantCell[] = [];
    for (const c of colors) {
        for (const s of sizes) {
            grid.push({ color: c, size: s, stock: 0 });
        }
    }
    return grid;
}

// ─── Number formatter ──────────────────────────────────────────────────────

function fmt(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n || 0);
}

// ─── Variant Grid Component ────────────────────────────────────────────────

function VariantGrid({
    variants,
    onChange,
}: {
    variants: VariantCell[];
    onChange: (updated: VariantCell[]) => void;
}) {
    const updateStock = (idx: number, value: string) => {
        const updated = variants.map((v, i) =>
            i === idx ? { ...v, stock: Number(value) || 0 } : v
        );
        onChange(updated);
    };

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    // Group by color for clean rendering
    const colorGroups = variants.reduce<Record<string, VariantCell[]>>((acc, v, i) => {
        const key = v.color || '__nocolor__';
        if (!acc[key]) acc[key] = [];
        acc[key].push({ ...v, _idx: i } as any);
        return acc;
    }, {});

    return (
        <div className="space-y-3">
            {/* Header stats */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                    <Grid3X3 className="w-3 h-3" />
                    Variant Zaxira Jadvali
                </div>
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-full px-2 py-0.5 text-[9px] font-black text-blue-400 tabular-nums">
                    Jami: {fmt(totalStock)} ta
                </div>
            </div>

            {/* Grid */}
            <div className="rounded-xl border border-neutral-800 overflow-hidden bg-[#050505]">
                {Object.entries(colorGroups).map(([colorKey, cells]) => (
                    <div key={colorKey} className="border-b border-neutral-800 last:border-b-0">
                        {/* Color header row */}
                        {colorKey !== '__nocolor__' && (
                            <div className="px-3 py-1.5 bg-neutral-900/60 flex items-center gap-2 border-b border-neutral-800/50">
                                <div
                                    className="w-3 h-3 rounded-full border border-neutral-700 flex-shrink-0"
                                    style={{
                                        backgroundColor: isValidColor(colorKey) ? colorKey : undefined,
                                        background: !isValidColor(colorKey) ? 'linear-gradient(135deg, #555, #888)' : undefined
                                    }}
                                />
                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300">
                                    {colorKey}
                                </span>
                                <span className="ml-auto text-[8px] text-neutral-600 font-bold">
                                    {(cells as any[]).reduce((s: number, c: any) => s + c.stock, 0)} ta
                                </span>
                            </div>
                        )}
                        {/* Size rows */}
                        <div className="divide-y divide-neutral-800/50">
                            {(cells as any[]).map((cell: any) => {
                                const idx = variants.findIndex(
                                    v => v.color === cell.color && v.size === cell.size
                                );
                                return (
                                    <div key={`${cell.color}-${cell.size}`}
                                        className="grid grid-cols-[1fr_auto] items-center px-3 py-2 gap-3 hover:bg-neutral-900/40 transition-colors">
                                        <div className="flex items-center gap-2">
                                            {cell.size ? (
                                                <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-black text-neutral-300 px-1.5">
                                                    {cell.size}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-neutral-500 italic">O'lcham yo'q</span>
                                            )}
                                            {cell.stock === 0 && (
                                                <span className="text-[7px] font-black uppercase text-red-500/70 tracking-widest">
                                                    TUGAGAN
                                                </span>
                                            )}
                                            {cell.stock > 0 && cell.stock <= 5 && (
                                                <span className="text-[7px] font-black uppercase text-amber-500/70 tracking-widest">
                                                    OZ QOLDI
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="number"
                                                min="0"
                                                value={cell.stock}
                                                onChange={e => updateStock(idx, e.target.value)}
                                                className={`w-20 text-center bg-neutral-900 border rounded-lg px-2 py-1.5 text-xs font-bold tabular-nums focus:outline-none transition-all touch-manipulation ${
                                                    cell.stock === 0
                                                        ? 'border-red-900/50 text-red-400 focus:border-red-600'
                                                        : cell.stock <= 5
                                                        ? 'border-amber-900/50 text-amber-400 focus:border-amber-600'
                                                        : 'border-neutral-700 text-white focus:border-blue-600'
                                                }`}
                                            />
                                            <span className="text-[9px] text-neutral-600 font-bold">ta</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick fill buttons */}
            <div className="flex gap-2 flex-wrap">
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-700 self-center">Tez to'ldirish:</span>
                {[5, 10, 20, 50].map(n => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(variants.map(v => ({ ...v, stock: n })))}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[9px] font-black text-neutral-400 hover:text-white transition-colors border border-neutral-700"
                    >
                        {n} ta
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onChange(variants.map(v => ({ ...v, stock: 0 })))}
                    className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/40 text-[9px] font-black text-red-500/70 hover:text-red-400 transition-colors border border-red-900/30"
                >
                    Tozalash
                </button>
            </div>
        </div>
    );
}

function isValidColor(color: string): boolean {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
}

// ─── Step Indicator ────────────────────────────────────────────────────────

function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
    const done    = current > step;
    const active  = current === step;
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${
                done   ? 'bg-emerald-500 text-white' :
                active ? 'bg-blue-600 text-white ring-2 ring-blue-600/30' :
                         'bg-neutral-800 text-neutral-600'
            }`}>
                {done ? <CheckCircle2 className="w-3 h-3" /> : step}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block ${
                active ? 'text-white' : done ? 'text-emerald-500' : 'text-neutral-600'
            }`}>{label}</span>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ProductsClient({ 
    products, 
    orgId, 
    totalCount = 0, 
    currentPage = 1, 
    pageSize = 20 
}: { 
    products: Product[]; 
    orgId: string;
    totalCount?: number;
    currentPage?: number;
    pageSize?: number;
}) {
    const router = useRouter();
    const [mounted, setMounted]       = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading]       = useState(false);
    const [step, setStep]             = useState(1); // 1: Info, 2: Variants, 3: Image

    const [modalMode, setModalMode]   = useState<ModalMode>('add');
    const [editId, setEditId]         = useState<string | null>(null);
    const [form, setForm]             = useState<ProductForm>(defaultForm);
    const [imageTab, setImageTab]     = useState<'upload' | 'url'>('upload');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Variant grid state
    const [variants, setVariants] = useState<VariantCell[]>([]);

    useEffect(() => { setMounted(true); }, []);

    // Auto-rebuild variant grid when colors/sizes change
    useEffect(() => {
        if (step === 2 || isModalOpen) {
            const colors = parseList(form.colors);
            const sizes  = parseList(form.sizes);
            setVariants(prev => {
                const newGrid = buildVariantGrid(colors, sizes);
                // Preserve existing stock values
                return newGrid.map(cell => {
                    const existing = prev.find(p => p.color === cell.color && p.size === cell.size);
                    return existing ? { ...cell, stock: existing.stock } : cell;
                });
            });
        }
    }, [form.colors, form.sizes]);

    // ─── File Upload with compression ─────────────────────────────────────

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        if (file.size > 1024 * 1024) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const MAX = 1000;
                if (width > height && width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
                else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    if (blob) setSelectedFile(new File([blob], file.name, { type: 'image/jpeg' }));
                    else setSelectedFile(file);
                }, 'image/jpeg', 0.85);
            };
            img.src = URL.createObjectURL(file);
        } else {
            setSelectedFile(file);
        }
    };

    // ─── Open modal ───────────────────────────────────────────────────────

    const openAdd = () => {
        setForm(defaultForm);
        setModalMode('add');
        setEditId(null);
        setImagePreview(null);
        setSelectedFile(null);
        setVariants([]);
        setStep(1);
        setModalOpen(true);
    };

    const openEdit = (p: Product) => {
        setForm({
            name:     p.name,
            category: p.categories?.name || 'Kiyim',
            price:    String(p.price),
            image:    p.sku || '',
            colors:   (p.colors || []).join(', '),
            sizes:    (p.sizes  || []).join(', '),
            label:    p.barcode || '',
        });
        setImagePreview(p.sku || null);
        setImageTab(p.sku && p.sku.startsWith('http') ? 'url' : 'upload');
        setModalMode('edit');
        setEditId(p.id);
        setSelectedFile(null);
        setStep(1);
        // Load existing variants
        fetch(`/api/admin/products/variants?productId=${p.id}`)
            .then(r => r.json())
            .then(data => setVariants(Array.isArray(data) ? data : []));
        setModalOpen(true);
    };

    // ─── Step navigation ──────────────────────────────────────────────────

    const goToStep2 = () => {
        if (!form.name || !form.price) return;
        const colors = parseList(form.colors);
        const sizes  = parseList(form.sizes);
        if (colors.length === 0 && sizes.length === 0) {
            setStep(3); // skip variant grid if no colors/sizes
        } else {
            setStep(2);
        }
    };

    const canGoStep2 = form.name.trim() !== '' && form.price.trim() !== '';
    const hasVariants = parseList(form.colors).length > 0 || parseList(form.sizes).length > 0;

    // ─── Save ─────────────────────────────────────────────────────────────

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!form.name || !form.price || loading) return;
        setLoading(true);

        try {
            // 1. Upload image if needed
            let finalImageUrl = form.image;
            if (imageTab === 'upload' && selectedFile) {
                const fd = new FormData();
                fd.append('file', selectedFile);
                fd.append('orgId', orgId);
                const upRes = await fetch('/api/admin/products/upload', { method: 'POST', body: fd });
                if (upRes.ok) {
                    finalImageUrl = (await upRes.json()).url;
                } else {
                    const txt = await upRes.text();
                    let msg = 'Rasm yuklashda xato';
                    try { msg = JSON.parse(txt).error; } catch {}
                    alert(msg); setLoading(false); return;
                }
            }

            const payload = {
                organization_id: orgId,
                name:     form.name,
                price:    Number(form.price),
                sizes:    parseList(form.sizes),
                colors:   parseList(form.colors),
                image_url: finalImageUrl || null,
                category: form.category || 'Kiyim',
                label:    form.label || null,
                variants: variants.length > 0 ? variants : undefined,
            };

            const url    = modalMode === 'add' ? '/api/admin/products' : `/api/admin/products/${editId}`;
            const method = modalMode === 'add' ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });

            if (res.ok) {
                const product = await res.json();
                // Let server endpoint handle variant inserts.
                // It now inserts variants natively through POST and PATCH (modified).
                setModalOpen(false);
                router.refresh();
            } else {
                const txt = await res.text();
                let msg = 'Saqlashda xatolik';
                try { msg = JSON.parse(txt).error || msg; } catch {}
                alert(msg);
            }
        } catch (err: any) {
            alert("Tarmoq xatosi. Qayta urinib ko'ring.");
            console.error(err);
        }
        setLoading(false);
    };

    // ─── Delete ───────────────────────────────────────────────────────────

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" o'chirilsinmi?`)) return;
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) router.refresh();
        else alert("O'chirishda xatolik yuz berdi");
    };

    // ─── Total stock from variants (for display) ──────────────────────────

    const totalVariantStock = variants.reduce((s, v) => s + v.stock, 0);
    const colors = parseList(form.colors);
    const sizes  = parseList(form.sizes);

    // ─── Render ───────────────────────────────────────────────────────────

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Mahsulotlar</h1>
                    <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-widest">Assortiment boshqaruvi</p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all text-xs shadow-lg shadow-blue-900/30"
                >
                    <Plus className="h-3.5 w-3.5" /> Qo'shish
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#060606] text-neutral-600 border-b border-neutral-800 text-[8px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="px-5 py-4 text-left">Mahsulot</th>
                                <th className="px-5 py-4 text-left hidden md:table-cell">Turkum</th>
                                <th className="px-5 py-4 text-left">Narxi</th>
                                <th className="px-5 py-4 text-left hidden lg:table-cell">Variantlar</th>
                                <th className="px-5 py-4 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-14 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-neutral-700" />
                                            </div>
                                            <div>
                                                <p className="text-neutral-400 text-sm font-bold">Mahsulotlar mavjud emas</p>
                                                <p className="text-neutral-700 text-xs mt-0.5">Birinchi mahsulotingizni qo'shing</p>
                                            </div>
                                            <button onClick={openAdd} className="mt-1 text-blue-500 hover:text-blue-400 text-xs font-black flex items-center gap-1 transition-colors">
                                                <Plus className="w-3 h-3" /> Qo'shish
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.map((p) => (
                                <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors group">
                                    {/* Product info */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                {p.sku ? (
                                                    <img src={p.sku} alt={p.name} className="w-full h-full object-cover"
                                                        onError={e => (e.currentTarget.src = 'https://placehold.co/80x80/111/444?text=X')} />
                                                ) : <ImageIcon className="w-4 h-4 text-neutral-700" />}
                                                {p.barcode && (
                                                    <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[6px] text-center font-black py-0.5 uppercase truncate">
                                                        {p.barcode}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm leading-tight">{p.name}</div>
                                                <div className={`text-[7px] mt-0.5 font-black uppercase tracking-widest ${p.is_active ? 'text-emerald-500' : 'text-neutral-600'}`}>
                                                    {p.is_active ? '● Active' : '○ Inactive'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Category */}
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        <span className="text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-full px-2 py-0.5 font-bold">
                                            {p.categories?.name || 'Kiyim'}
                                        </span>
                                    </td>
                                    {/* Price */}
                                    <td className="px-5 py-3.5">
                                        <span suppressHydrationWarning className="font-mono font-black text-white text-sm tabular-nums">
                                            {mounted ? fmt(p.price) : '—'}
                                        </span>
                                        <span className="text-[9px] text-neutral-600 ml-1">so'm</span>
                                    </td>
                                    {/* Variants summary */}
                                    <td className="px-5 py-3.5 hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {(p.colors || []).slice(0, 3).map((c: string) => (
                                                <span key={c} className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-neutral-400">
                                                    <span className="w-2 h-2 rounded-full border border-neutral-700 inline-block"
                                                        style={{ background: isValidColor(c) ? c : '#555' }} />
                                                    {c}
                                                </span>
                                            ))}
                                            {(p.sizes || []).slice(0, 3).map((s: string) => (
                                                <span key={s} className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-[8px] font-black text-neutral-400">
                                                    {s}
                                                </span>
                                            ))}
                                            {((p.colors || []).length + (p.sizes || []).length) === 0 && (
                                                <span className="text-[9px] text-neutral-700 italic">Variant yo'q</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                            <button onClick={() => openEdit(p)}
                                                className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-white rounded-lg transition-all active:scale-95"
                                                aria-label={`${p.name} tahrirlash`}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id, p.name)}
                                                className="p-2 hover:bg-red-950/40 text-neutral-500 hover:text-red-500 rounded-lg transition-all active:scale-95"
                                                aria-label={`${p.name} o'chirish`}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalCount > pageSize && (
                    <div className="flex items-center justify-between border-t border-neutral-800 bg-[#060606] px-5 py-3">
                        <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                            Jami: {totalCount} ta mahsulot
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                               disabled={currentPage <= 1}
                               onClick={() => router.push(`/dashboard/products?page=${currentPage - 1}`)}
                               className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Oldingi
                            </button>
                            <span className="text-xs font-bold text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                                {currentPage}
                            </span>
                            <button
                               disabled={currentPage * pageSize >= totalCount}
                               onClick={() => router.push(`/dashboard/products?page=${currentPage + 1}`)}
                               className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Keyingi
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── PRO Modal ─────────────────────────────────────────────── */}
            {isModalOpen && mounted && createPortal(
                <div
                    onClick={e => e.target === e.currentTarget && setModalOpen(false)}
                    className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4"
                    style={{ animation: 'fadeIn 150ms ease-out' }}
                >
                    <div className="bg-[#0d0d0d] border border-neutral-800/80 w-full sm:max-w-[400px] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh]"
                        style={{ animation: 'slideUp 200ms cubic-bezier(0.33, 1, 0.68, 1)' }}>

                        {/* ── Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                                    <Package className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-black text-white text-xs uppercase tracking-widest">
                                        {modalMode === 'add' ? 'Yangi mahsulot' : 'Tahrirlash'}
                                    </h2>
                                    <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">
                                        {step === 1 ? 'Asosiy ma\'lumotlar' : step === 2 ? 'Variant zaxirasi' : 'Rasm'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setModalOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* ── Step progress bar */}
                        <div className="flex items-center gap-0 px-5 py-3 border-b border-neutral-800/50 flex-shrink-0">
                            <StepDot step={1} current={step} label="Ma'lumot" />
                            <div className={`h-px flex-1 mx-2 transition-colors ${step > 1 ? 'bg-emerald-700' : 'bg-neutral-800'}`} />
                            <StepDot step={2} current={step} label="Variant" />
                            <div className={`h-px flex-1 mx-2 transition-colors ${step > 2 ? 'bg-emerald-700' : 'bg-neutral-800'}`} />
                            <StepDot step={3} current={step} label="Rasm" />
                        </div>

                        {/* ── Scrollable body */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            {/* ══ STEP 1: Basic info ══════════════════════════════ */}
                            {step === 1 && (
                                <div className="p-5 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                            Nomi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name} required
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Masalan: Sport kurtka..."
                                            className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>

                                    {/* Category + Label */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                                <Tag className="w-2.5 h-2.5 inline mr-1" />Turkum
                                            </label>
                                            <input
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                placeholder="Kiyim..."
                                                className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                                <Tag className="w-2.5 h-2.5 inline mr-1" />Label
                                            </label>
                                            <input
                                                value={form.label}
                                                onChange={e => setForm({ ...form, label: e.target.value })}
                                                placeholder="Yangi..."
                                                className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                            Narxi (so'm) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number" inputMode="numeric"
                                            value={form.price} required
                                            onChange={e => setForm({ ...form, price: e.target.value })}
                                            placeholder="150000"
                                            className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-mono font-bold placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>

                                    {/* Colors + Sizes */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                                <Palette className="w-2.5 h-2.5 inline mr-1" />Ranglar
                                            </label>
                                            <input
                                                value={form.colors}
                                                onChange={e => setForm({ ...form, colors: e.target.value })}
                                                placeholder="Qora, Oq..."
                                                className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                                style={{ fontSize: '16px' }}
                                            />
                                            {colors.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {colors.map(c => (
                                                        <span key={c} className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-neutral-400">
                                                            <span className="w-2 h-2 rounded-full border border-neutral-700"
                                                                style={{ background: isValidColor(c) ? c : '#555' }} />
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                                <Ruler className="w-2.5 h-2.5 inline mr-1" />O'lchamlar
                                            </label>
                                            <input
                                                value={form.sizes}
                                                onChange={e => setForm({ ...form, sizes: e.target.value })}
                                                placeholder="L, XL, 42..."
                                                className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white placeholder:text-neutral-800 focus:border-blue-600 focus:outline-none transition-all touch-manipulation"
                                                style={{ fontSize: '16px' }}
                                            />
                                            {sizes.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {sizes.map(s => (
                                                        <span key={s} className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-[8px] font-black text-neutral-400">{s}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Variant count preview */}
                                    {hasVariants && (
                                        <div className="rounded-xl border border-blue-900/30 bg-blue-950/20 px-4 py-3 flex items-center gap-2.5">
                                            <Layers className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-blue-300">
                                                    {colors.length > 0 && sizes.length > 0
                                                        ? `${colors.length} rang × ${sizes.length} o'lcham = ${colors.length * sizes.length} variant`
                                                        : colors.length > 0
                                                        ? `${colors.length} rang varianti`
                                                        : `${sizes.length} o'lcham varianti`}
                                                </p>
                                                <p className="text-[8px] text-blue-600 font-bold mt-0.5">Keyingi qadamda miqdorlarni kiriting</p>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ══ STEP 2: Variant grid ════════════════════════════ */}
                            {step === 2 && (
                                <div className="p-5 space-y-4">
                                    {variants.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center">
                                            <AlertCircle className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                                            <p className="text-neutral-500 text-xs font-bold">Rang yoki o'lcham yo'q</p>
                                            <p className="text-neutral-700 text-[10px] mt-1">1-qadamga qaytib variant kiriting</p>
                                        </div>
                                    ) : (
                                        <VariantGrid variants={variants} onChange={setVariants} />
                                    )}
                                </div>
                            )}

                            {/* ══ STEP 3: Image ══════════════════════════════════ */}
                            {step === 3 && (
                                <div className="p-5 space-y-4">
                                    {/* Summary card */}
                                    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 space-y-2">
                                        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Xulosa</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-neutral-400">Mahsulot:</span>
                                            <span className="text-xs font-bold text-white">{form.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-neutral-400">Narxi:</span>
                                            <span className="text-xs font-black text-white tabular-nums">{fmt(Number(form.price))} so'm</span>
                                        </div>
                                        {variants.length > 0 && (
                                            <div className="flex items-center justify-between border-t border-neutral-800 pt-2 mt-2">
                                                <span className="text-xs text-neutral-400">Jami zaxira:</span>
                                                <span className="text-xs font-black text-emerald-400 tabular-nums">{totalVariantStock} ta</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image tabs */}
                                    <div>
                                        <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2">
                                            Mahsulot rasmi (ixtiyoriy)
                                        </label>
                                        <div className="flex bg-[#060606] rounded-xl p-1 mb-3 border border-neutral-800">
                                            <button type="button" onClick={() => setImageTab('upload')}
                                                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-1.5 transition-all ${imageTab === 'upload' ? 'bg-neutral-800 text-white' : 'text-neutral-700'}`}>
                                                <Upload className="w-3 h-3" /> Fayl
                                            </button>
                                            <button type="button" onClick={() => setImageTab('url')}
                                                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-1.5 transition-all ${imageTab === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-700'}`}>
                                                <Link2 className="w-3 h-3" /> Havola
                                            </button>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                {imageTab === 'upload' ? (
                                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 bg-[#060606] rounded-xl px-3 py-5 cursor-pointer hover:border-blue-800 hover:bg-blue-950/10 transition-all active:scale-[0.98] touch-manipulation">
                                                        <Upload className="h-5 w-5 mb-2 text-neutral-700" />
                                                        <span className="text-[9px] font-black uppercase tracking-tight text-neutral-600">
                                                            {selectedFile ? selectedFile.name.slice(0, 14) + '...' : 'Rasm tanlang'}
                                                        </span>
                                                        <span className="text-[7px] text-neutral-800 mt-0.5">JPG, PNG, WEBP · Maks 10MB</span>
                                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                    </label>
                                                ) : (
                                                    <input
                                                        value={form.image}
                                                        onChange={e => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }}
                                                        placeholder="https://..."
                                                        className="w-full bg-[#060606] border border-neutral-800 rounded-xl px-3 py-3 text-xs text-white touch-manipulation"
                                                        style={{ fontSize: '16px' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="w-16 h-16 rounded-xl bg-[#060606] border border-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {imagePreview
                                                    ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                    : <ImageIcon className="h-6 w-6 text-neutral-800" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Footer buttons ─────────────────────────────────── */}
                        <div className="px-5 py-4 border-t border-neutral-800/80 flex gap-2.5 flex-shrink-0 bg-[#0a0a0a] rounded-b-3xl sm:rounded-b-2xl">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(s => s - 1)}
                                    className="flex-1 border border-neutral-800 text-neutral-500 px-3 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest touch-manipulation">
                                    ← Ortga
                                </button>
                            ) : (
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="flex-1 border border-neutral-800 text-neutral-600 px-3 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest touch-manipulation">
                                    Bekor
                                </button>
                            )}

                            {step === 1 && (
                                <button type="button" onClick={goToStep2}
                                    disabled={!canGoStep2}
                                    className="flex-[2] bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-neutral-700 touch-manipulation">
                                    Davom <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                            {step === 2 && (
                                <button type="button" onClick={() => setStep(3)}
                                    className="flex-[2] bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-neutral-700 touch-manipulation">
                                    Davom <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                            {step === 3 && (
                                <button type="button" onClick={handleSave} disabled={loading}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white px-3 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 touch-manipulation">
                                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                                        <><CheckCircle2 className="h-3.5 w-3.5" /> Saqlash</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style jsx global>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}
