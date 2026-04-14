'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Pencil, Trash2, X, ImageIcon, Save, Package,
    ChevronDown, ChevronRight, Grid3X3, Loader2,
    AlertTriangle, CheckCircle2, TrendingDown,
    Calendar, MoreVertical, Eraser
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProductVariant {
    id:    string;
    color: string;
    size:  string;
    stock: number;
}

interface Product {
    id:         string;
    name:       string;
    price:      number;
    sku:        string | null;
    barcode:    string | null;
    is_active:  boolean;
    colors:     string[];
    sizes:      string[];
    categories?: { name: string };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatPrice(n: number) {
    if (n == null) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' mln';
    if (n >= 1_000)    return (n / 1_000).toFixed(0) + ' ming';
    return n.toLocaleString();
}

function isValidColor(c: string) {
    const s = new Option().style;
    s.color = c;
    return s.color !== '';
}

// ─── Stock Status Badge ────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0)  return <span className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 ring-1 ring-red-500/20">Tugagan</span>;
    if (stock <= 5)   return <span className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">Oz qoldi</span>;
    if (stock <= 20)  return <span className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">Normal</span>;
    return <span className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Yetarli</span>;
}

// ─── PRO Edit Modal (Oynasi) ────────────────────────────────────────────────

// Oynaning maqsadi: Variant yoki Ombor mahsulotini tahrirlash, 
// va foydalanuvchi so'raganidek "sanadan sanagacha tozalash" qulayligini taqdim etish.
function ProEditModal({
    variant,
    productName,
    onClose,
    onSave,
}: {
    variant: ProductVariant;
    productName: string;
    onClose: () => void;
    onSave:  (id: string, newStock: number) => Promise<void>;
}) {
    const [stockValue, setStockValue] = useState(String(variant.stock));
    const [saving, setSaving] = useState(false);
    


    const handleSave = async () => {
        setSaving(true);
        await onSave(variant.id, Number(stockValue) || 0);
        setSaving(false);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0a0a0a] border border-neutral-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" 
                 style={{ animation: 'slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-[#0d0d0d]">
                    <div>
                        <h2 className="text-lg font-black text-white">{productName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {variant.color && (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-0.5">
                                    <span className="w-2.5 h-2.5 rounded-full border border-neutral-700" style={{ background: isValidColor(variant.color) ? variant.color : '#888' }} />
                                    {variant.color}
                                </span>
                            )}
                            {variant.size && (
                                <span className="text-xs font-black text-neutral-300 bg-neutral-800 border border-neutral-700 rounded items-center px-1.5 py-0.5">
                                    {variant.size}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Zaxira tahrirlash */}
                    <div className="mb-6">
                        <label className="block mb-2 text-xs font-black uppercase tracking-widest text-neutral-500">
                            Zaxira miqdorini tahrirlash
                        </label>
                        <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-2xl focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all overflow-hidden group">
                            <input
                                type="number" min="0" value={stockValue} onChange={e => setStockValue(e.target.value)}
                                className="flex-1 w-full text-2xl font-black text-white bg-transparent pl-5 pr-2 py-4 focus:outline-none tabular-nums"
                                placeholder="0"
                            />
                            <div className="text-sm font-bold text-neutral-500 pr-5 select-none">dona</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 text-sm font-bold transition-colors">
                            Bekor qilish
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex-[2] py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            O'zgarishlarni saqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Variant Row ───────────────────────────────────────────────────────────

function VariantRow({
    variant,
    productName,
    onUpdate,
    onDelete,
}: {
    variant: ProductVariant;
    productName: string;
    onUpdate: (id: string, stock: number) => Promise<void>;
    onDelete: (id: string, color: string, size: string) => void;
}) {
    const [editModalOpen, setEditModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800/30 last:border-b-0 hover:bg-neutral-900/40 transition-colors group">
                <div className="flex items-center gap-3">
                    {/* Color dot */}
                    {variant.color && (
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 flex-shrink-0"
                            style={{ background: isValidColor(variant.color) ? variant.color : 'linear-gradient(135deg,#555,#888)' }}
                            title={variant.color} />
                    )}
                    {/* Labels */}
                    <div className="flex items-center gap-2">
                        {variant.color && <span className="text-xs text-neutral-300 font-bold">{variant.color}</span>}
                        {variant.color && variant.size && <span className="text-neutral-700">·</span>}
                        {variant.size && (
                            <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-black text-neutral-300 px-1.5">
                                {variant.size}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stock editor trigger & actions */}
                <div className="flex items-center gap-3">
                    <StockBadge stock={variant.stock} />
                    <div className="flex items-center gap-1.5 border border-neutral-800 rounded-xl bg-neutral-900 overflow-hidden group-hover:border-neutral-600 transition-all">
                        <button onClick={() => setEditModalOpen(true)}
                            className="flex items-center gap-2 pl-3 pr-2 py-1.5 hover:bg-neutral-800 transition-colors">
                            <span className="text-sm font-black text-white tabular-nums">{variant.stock}</span>
                            <div className="h-4 w-[1px] bg-neutral-800" />
                            <Pencil className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" />
                        </button>
                        <button onClick={() => onDelete(variant.id, variant.color, variant.size)}
                            className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors mr-1 rounded-lg"
                            title="O'chirish">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {editModalOpen && (
                <ProEditModal
                    variant={variant}
                    productName={productName}
                    onClose={() => setEditModalOpen(false)}
                    onSave={onUpdate}
                />
            )}
        </>
    );
}

// ─── Product Row with expandable variants ──────────────────────────────────

function ProductInventoryRow({ product }: { product: Product & { variants?: ProductVariant[] } }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [variants,  setVariants] = useState<ProductVariant[]>(product.variants || []);
    const [loading,   setLoading]  = useState(false);
    const [loaded,    setLoaded]   = useState(!!product.variants?.length);

    const hasVariants = (product.colors?.length || 0) + (product.sizes?.length || 0) > 0;
    const totalStock  = variants.reduce((s, v) => s + v.stock, 0);

    // Load variants lazily on expand
    const handleExpand = async () => {
        if (!expanded && !loaded) {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/products/variants?productId=${product.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setVariants(Array.isArray(data) ? data : []);
                    setLoaded(true);
                }
            } finally {
                setLoading(false);
            }
        }
        setExpanded(e => !e);
    };

    const updateVariantStock = async (variantId: string, stock: number) => {
        await fetch('/api/admin/products/variants', {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id: variantId, stock }),
        });
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock } : v));
        router.refresh();
    };

    const deleteVariant = async (variantId: string, color: string, size: string) => {
        const label = `${color || ''} ${size || ''}`.trim();
        if (!confirm(`Rostdan ham "${label}" variantini o'chirmoqchimisiz?`)) return;
        
        await fetch(`/api/admin/products/variants?id=${variantId}`, {
            method: 'DELETE',
        });
        setVariants(prev => prev.filter(v => v.id !== variantId));
        router.refresh();
    };

    const criticalVariants = variants.filter(v => v.stock === 0).length;
    const lowVariants      = variants.filter(v => v.stock > 0 && v.stock <= 5).length;

    return (
        <div className="border-b border-neutral-800/80 last:border-b-0 hover:bg-neutral-900/20 transition-colors">
            {/* Main product row */}
            <div
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer ${expanded ? 'bg-neutral-900/40 relative' : ''}`}
                onClick={hasVariants ? handleExpand : undefined}
            >
                {/* Expand icon */}
                <div className={`w-5 flex-shrink-0 flex justify-center ${!hasVariants ? 'opacity-0 pointer-events-none' : ''}`}>
                    {loading
                        ? <Loader2 className="w-3.5 h-3.5 text-neutral-600 animate-spin" />
                        : expanded
                        ? <ChevronDown className="w-4 h-4 text-blue-400" />
                        : <ChevronRight className="w-4 h-4 text-neutral-600" />
                    }
                </div>

                {/* Image */}
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-neutral-800 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
                    {product.sku
                        ? <img src={product.sku} alt={product.name} className="w-full h-full object-cover"
                            onError={e => (e.currentTarget.src = 'https://placehold.co/80x80/111/444?text=X')} />
                        : <ImageIcon className="w-4 h-4 text-neutral-700" />
                    }
                </div>

                {/* Name + Category */}
                <div className="flex-1 min-w-0 pr-4">
                    <div className="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">{product.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                            {product.categories?.name || 'Kiyim'}
                        </span>
                        {criticalVariants > 0 && (
                            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                                <AlertTriangle className="w-2.5 h-2.5" /> {criticalVariants} ta tugagan
                            </span>
                        )}
                        {criticalVariants === 0 && lowVariants > 0 && (
                            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                <TrendingDown className="w-2.5 h-2.5" /> {lowVariants} ta oz qoldi
                            </span>
                        )}
                    </div>
                </div>

                {/* Return values section */}
                <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                        <div className="font-mono font-black text-sm text-neutral-300 tabular-nums">
                            {formatPrice(product.price)}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold mt-0.5">so'm / dona</div>
                    </div>

                    <div className="text-right">
                        {hasVariants && loaded ? (
                            <div>
                                <div className={`font-black text-base tabular-nums flex items-center justify-end gap-1 ${
                                    totalStock === 0 ? 'text-red-500' :
                                    totalStock <= 10 ? 'text-amber-400' :
                                    'text-emerald-400'
                                }`}>
                                    {totalStock}
                                </div>
                                <div className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold mt-0.5">Jami zaxira</div>
                            </div>
                        ) : !hasVariants ? (
                            <span className="inline-block px-2 py-1 rounded bg-neutral-900 text-[10px] text-neutral-600 font-bold italic">Variant yo'q</span>
                        ) : (
                            <div className="h-8 flex flex-col justify-end">
                                <span className="text-xs text-neutral-600 font-bold">Ko'rish →</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded variant list */}
            {expanded && (
                <div className="relative border-t border-neutral-800/50 bg-[#0d0d0d]"
                    style={{ animation: 'expandDown 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    
                    {/* Inner left border accent */}
                    <div className="absolute left-6 top-4 bottom-4 w-px bg-neutral-800" />
                    
                    <div className="pl-14 pr-4 py-3">
                        {/* Variant header */}
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-900 rounded px-2 py-1">
                                {variants.length} ta kombinatsiya
                            </span>
                            {criticalVariants === 0 && lowVariants === 0 && variants.length > 0 && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 rounded px-2 py-1">
                                    <CheckCircle2 className="w-3 h-3" /> Zaxira yetarli
                                </span>
                            )}
                        </div>

                        {variants.length === 0 ? (
                            <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-neutral-800">
                                <p className="text-neutral-500 text-sm font-bold">Variantlar topilmadi</p>
                                <p className="text-neutral-600 text-xs mt-1">Mahsulotlarni boshqarish menyusidan qoshing</p>
                            </div>
                        ) : (
                            <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-sm">
                                {variants.map(v => (
                                    <VariantRow key={v.id} variant={v} productName={product.name} onUpdate={updateVariantStock} onDelete={deleteVariant} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Bulk Cleanup Modal ──────────────────────────────────────────────────
function BulkCleanupModal({
    onClose
}: {
    onClose: () => void;
}) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [limit, setLimit] = useState('50');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCleanup = async () => {
        if (!fromDate || !toDate) {
            alert("Sanani to'liq kiriting");
            return;
        }

        if (confirm(`Rostdan ham ${fromDate} dan ${toDate} gacha bo'lgan, ${limit === 'all' ? 'barcha' : limit + ' ta'} variantlarni o'chirib, zaxirani tozalab yubormoqchimisiz?`)) {
            setLoading(true);
            try {
                // Here we call the API to perform the bulk delete
                const res = await fetch(`/api/admin/inventory/cleanup?fromDate=${fromDate}&toDate=${toDate}&limit=${limit}`, {
                    method: 'DELETE'
                });
                
                if (res.ok) {
                    alert("Muvaffaqiyatli tozalandi!");
                    router.refresh();
                    onClose();
                } else {
                    const data = await res.json();
                    alert("Xato: " + (data.error || "Noma'lum xato"));
                }
            } catch (err: any) {
                alert("Xato: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0a0a0a] border border-neutral-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden" 
                 style={{ animation: 'slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-[#0d0d0d]">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-red-500/10 text-red-400">
                                <Eraser className="w-5 h-5" />
                            </span>
                            Kengaytirilgan tozalash
                        </h2>
                        <p className="text-xs text-neutral-500 mt-2 font-medium">Belgilangan sanadagi aktivitetlar / variantlar arxivi tozalab yuboriladi.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all self-start">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 text-[10px] font-black uppercase tracking-wider text-neutral-500">Sanadan</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white text-sm pl-10 pr-4 py-3 rounded-2xl focus:border-red-500/50 focus:outline-none transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-[10px] font-black uppercase tracking-wider text-neutral-500">Sanagacha</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white text-sm pl-10 pr-4 py-3 rounded-2xl focus:border-red-500/50 focus:outline-none transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 text-[10px] font-black uppercase tracking-wider text-neutral-500">O'chirilishi kerak bo'lgan ma'lumotlar miqdori (Limit)</label>
                        <select value={limit} onChange={e => setLimit(e.target.value)}
                            className="w-full bg-neutral-900/50 border border-neutral-800 text-white text-sm px-4 py-3.5 rounded-2xl focus:border-red-500/50 focus:outline-none appearance-none cursor-pointer">
                            <option value="20">20 ta</option>
                            <option value="50">50 ta</option>
                            <option value="100">100 ta</option>
                            <option value="all">Hammasi (Cheklovsiz)</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-neutral-400 hover:text-white bg-neutral-900/50 hover:bg-neutral-800 text-sm font-bold transition-colors">
                            Bekor qilish
                        </button>
                        <button onClick={handleCleanup} disabled={loading || !fromDate || !toDate} 
                            className="flex-[2] py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            Tozalashni boshlash
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Main Inventory Client ─────────────────────────────────────────────────

export default function InventoryClient({ products }: { products: Product[] }) {
    const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
    const [cleanupModalOpen, setCleanupModalOpen] = useState(false);

    const filtered = products.filter(p => {
        if (filter === 'all') return true;
        // For now filter by product status
        return true;
    });

    const totalProducts = products.length;

    return (
        <div className="animate-fade-in pb-20">
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-neutral-800">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        Ombor <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">PRO</span>
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Barcha filiallar bo'yicha zaxira tahlili va boshqaruvi</p>
                </div>
                
                {/* Action shortcut */}
                <button
                    onClick={() => setCleanupModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Kengaytirilgan tozalash (Sana bo'yicha)
                </button>
            </div>

            {cleanupModalOpen && <BulkCleanupModal onClose={() => setCleanupModalOpen(false)} />}

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: "Jami Turlar", value: totalProducts, color: "text-white" },
                    { label: "Sotuvda", value: products.filter(p => p.is_active).length, color: "text-blue-400" },
                    { label: "Tugagan", value: 0, color: "text-red-400" }, // Demo statistic
                    { label: "Nofaol", value: products.filter(p => !p.is_active).length, color: "text-neutral-500" },
                ].map(stat => (
                    <div key={stat.label} className="bg-[#0a0a0a] shadow-md border border-neutral-800/80 rounded-2xl px-5 py-4 flex flex-col justify-center transition-all hover:border-neutral-700">
                        <div className={`text-3xl font-black tabular-nums tracking-tight ${stat.color}`}>{stat.value}</div>
                        <div className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Product list */}
            {products.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-neutral-800 bg-[#0a0a0a] p-16 text-center shadow-lg">
                    <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-5">
                        <Package className="w-7 h-7 text-neutral-600" />
                    </div>
                    <p className="text-neutral-300 text-base font-bold">Mahsulotlar mavjud emas</p>
                    <p className="text-neutral-500 text-sm mt-1 mb-6 max-w-sm mx-auto">Avval "Mahsulotlar" bo'limidan mahsulot yarating va zaxira taqsimlang</p>
                    <button onClick={() => window.location.href='/dashboard/products'} className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors">
                        Sklad qo'shish
                    </button>
                </div>
            ) : (
                <div className="rounded-3xl border border-neutral-800/80 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                    <div className="px-5 py-4 bg-[#050505] border-b border-neutral-800 flex items-center gap-3 relative z-10">
                        <Grid3X3 className="w-4 h-4 text-neutral-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                            Zaxira balansi ro'yxati
                        </span>
                        <div className="ml-auto text-[9px] text-neutral-600 font-bold bg-neutral-900 px-2 py-1 rounded hidden sm:block">
                            Pastga suring • Tahrirlash uchun qalamchani bosing
                        </div>
                    </div>

                    <div>
                        {filtered.map(p => (
                            <ProductInventoryRow key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes expandDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
