'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Pencil, Trash2, X, ImageIcon, Save, Package,
    ChevronDown, ChevronRight, Grid3X3, Loader2,
    AlertTriangle, CheckCircle2, TrendingDown
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

// ─── Variant Row ───────────────────────────────────────────────────────────

function VariantRow({
    variant,
    onUpdate,
}: {
    variant: ProductVariant;
    onUpdate: (id: string, stock: number) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue]    = useState(String(variant.stock));
    const [saving, setSaving]  = useState(false);

    const save = async () => {
        if (value === String(variant.stock)) { setEditing(false); return; }
        setSaving(true);
        await onUpdate(variant.id, Number(value) || 0);
        setSaving(false);
        setEditing(false);
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-800/30 last:border-b-0 hover:bg-neutral-900/20 transition-colors group">
            {/* Color dot */}
            {variant.color && (
                <div className="w-3 h-3 rounded-full border border-neutral-700 flex-shrink-0"
                    style={{ background: isValidColor(variant.color) ? variant.color : 'linear-gradient(135deg,#555,#888)' }}
                    title={variant.color} />
            )}
            {/* Labels */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {variant.color && <span className="text-[10px] text-neutral-400 font-bold">{variant.color}</span>}
                {variant.color && variant.size && <span className="text-neutral-700">·</span>}
                {variant.size && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-5 rounded bg-neutral-800 border border-neutral-700 text-[8px] font-black text-neutral-300 px-1">
                        {variant.size}
                    </span>
                )}
            </div>
            {/* Stock editor */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <StockBadge stock={variant.stock} />
                {editing ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="number" inputMode="numeric" min="0"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
                            autoFocus
                            className="w-16 text-center bg-neutral-900 border border-blue-600 rounded-lg px-2 py-1 text-xs font-black text-white focus:outline-none tabular-nums"
                        />
                        <button onClick={save} disabled={saving}
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors">
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        </button>
                        <button onClick={() => { setEditing(false); setValue(String(variant.stock)); }}
                            className="p-1.5 hover:bg-neutral-800 text-neutral-600 hover:text-white rounded-lg transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => { setEditing(true); setValue(String(variant.stock)); }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 transition-all group-hover:opacity-100 opacity-70">
                        <span className="text-xs font-black text-white tabular-nums">{variant.stock}</span>
                        <span className="text-[8px] text-neutral-600 font-bold">ta</span>
                        <Pencil className="w-2.5 h-2.5 text-neutral-600 ml-0.5" />
                    </button>
                )}
            </div>
        </div>
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

    const handleDelete = async () => {
        if (!confirm(`"${product.name}" mahsulotini o'chirasizmi?`)) return;
        await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
        router.refresh();
    };

    const criticalVariants = variants.filter(v => v.stock === 0).length;
    const lowVariants      = variants.filter(v => v.stock > 0 && v.stock <= 5).length;

    return (
        <div className="border-b border-neutral-800/60 last:border-b-0">
            {/* Main product row */}
            <div
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-900/30 transition-colors cursor-pointer ${expanded ? 'bg-neutral-900/20' : ''}`}
                onClick={hasVariants ? handleExpand : undefined}
            >
                {/* Expand icon */}
                <div className={`w-5 flex-shrink-0 ${!hasVariants ? 'opacity-0 pointer-events-none' : ''}`}>
                    {loading
                        ? <Loader2 className="w-3.5 h-3.5 text-neutral-600 animate-spin" />
                        : expanded
                        ? <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                        : <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                    }
                </div>

                {/* Image */}
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.sku
                        ? <img src={product.sku} alt={product.name} className="w-full h-full object-cover"
                            onError={e => (e.currentTarget.src = 'https://placehold.co/80x80/111/444?text=X')} />
                        : <ImageIcon className="w-4 h-4 text-neutral-700" />
                    }
                </div>

                {/* Name + Category */}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{product.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-neutral-600 font-bold">
                            {product.categories?.name || 'Kiyim'}
                        </span>
                        {criticalVariants > 0 && (
                            <span className="flex items-center gap-0.5 text-[7px] font-black uppercase text-red-500">
                                <AlertTriangle className="w-2.5 h-2.5" /> {criticalVariants} ta tugagan
                            </span>
                        )}
                        {criticalVariants === 0 && lowVariants > 0 && (
                            <span className="flex items-center gap-0.5 text-[7px] font-black uppercase text-amber-500">
                                <TrendingDown className="w-2.5 h-2.5" /> {lowVariants} ta oz qoldi
                            </span>
                        )}
                    </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className="font-mono font-black text-sm text-white tabular-nums">
                        {formatPrice(product.price)}
                    </div>
                    <div className="text-[8px] text-neutral-600 font-bold">so'm</div>
                </div>

                {/* Total stock */}
                <div className="flex-shrink-0 text-right ml-2">
                    {hasVariants && loaded ? (
                        <div>
                            <div className={`font-black text-sm tabular-nums ${
                                totalStock === 0 ? 'text-red-500' :
                                totalStock <= 10 ? 'text-amber-400' :
                                'text-emerald-400'
                            }`}>{totalStock}</div>
                            <div className="text-[8px] text-neutral-600 font-bold">jami ta</div>
                        </div>
                    ) : !hasVariants ? (
                        <span className="text-[9px] text-neutral-700 font-bold italic">Variant yo'q</span>
                    ) : (
                        <span className="text-[9px] text-neutral-700">...</span>
                    )}
                </div>

                {/* Delete (no-propagation) */}
                <button
                    onClick={e => { e.stopPropagation(); handleDelete(); }}
                    className="p-1.5 text-neutral-700 hover:text-red-500 hover:bg-red-950/30 rounded-lg transition-all flex-shrink-0 ml-1"
                    aria-label={`${product.name} o'chirish`}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Expanded variant list */}
            {expanded && (
                <div className="ml-8 mr-4 mb-3 rounded-xl border border-neutral-800/60 bg-neutral-950/40 overflow-hidden"
                    style={{ animation: 'expandDown 150ms ease-out' }}>
                    {/* Variant grid header */}
                    <div className="px-4 py-2 bg-neutral-900/50 border-b border-neutral-800/60 flex items-center gap-2">
                        <Grid3X3 className="w-3 h-3 text-neutral-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                            Variant zaxirasi — {variants.length} ta kombinatsiya
                        </span>
                        {criticalVariants === 0 && lowVariants === 0 && variants.length > 0 && (
                            <span className="ml-auto flex items-center gap-1 text-[7px] font-black uppercase text-emerald-600">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Yetarli
                            </span>
                        )}
                    </div>

                    {variants.length === 0 ? (
                        <div className="py-6 px-4 text-center">
                            <p className="text-neutral-700 text-xs font-bold">Variant zaxirasi topilmadi</p>
                            <p className="text-neutral-800 text-[9px] mt-1">Mahsulotni tahrirlang va variant qo'shing</p>
                        </div>
                    ) : (
                        <div>
                            {variants.map(v => (
                                <VariantRow key={v.id} variant={v} onUpdate={updateVariantStock} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Inventory Client ─────────────────────────────────────────────────

export default function InventoryClient({ products }: { products: Product[] }) {
    const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

    const filtered = products.filter(p => {
        if (filter === 'all') return true;
        // For now filter by product status - variants loaded lazily
        return true;
    });

    const totalProducts = products.length;

    return (
        <>
            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: "Jami mahsulot", value: totalProducts, color: "text-white" },
                    { label: "Faol", value: products.filter(p => p.is_active).length, color: "text-emerald-400" },
                    { label: "Nofaol", value: products.filter(p => !p.is_active).length, color: "text-neutral-500" },
                ].map(stat => (
                    <div key={stat.label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
                        <div className={`text-xl font-black tabular-nums ${stat.color}`}>{stat.value}</div>
                        <div className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Product list */}
            {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 p-14 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                        <Package className="w-6 h-6 text-neutral-700" />
                    </div>
                    <p className="text-neutral-500 text-sm font-bold">Mahsulotlar mavjud emas</p>
                    <p className="text-neutral-700 text-xs mt-1">Avval "Mahsulotlar" bo'limidan mahsulot qo'shing</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-neutral-800/80 bg-[#0a0a0a] overflow-hidden shadow-xl">
                    {/* Table header */}
                    <div className="px-4 py-3 bg-[#060606] border-b border-neutral-800 flex items-center gap-2">
                        <Grid3X3 className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                            Mahsulot bo'yicha zaxira holati
                        </span>
                        <span className="ml-auto text-[8px] text-neutral-700 font-bold">
                            Variantni ko'rish uchun bosing
                        </span>
                    </div>

                    {/* Rows */}
                    {filtered.map(p => (
                        <ProductInventoryRow key={p.id} product={p} />
                    ))}
                </div>
            )}

            <style jsx global>{`
                @keyframes expandDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
