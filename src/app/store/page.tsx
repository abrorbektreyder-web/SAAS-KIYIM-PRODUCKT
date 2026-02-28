'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { sortOptions, formatStorePrice, type StoreProduct } from '@/lib/store-data';
import { useCart } from '@/lib/cart-context';
import { useProducts } from '@/lib/product-context';

function ProductCard({ product }: { product: StoreProduct }) {
    const { addItem, items } = useCart();
    const [added, setAdded] = useState(false);
    const inCart = items.find((i) => i.product.id === product.id);

    const handleAdd = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-white transition-all duration-300 hover:border-neutral-600 hover:shadow-xl hover:shadow-black/20 card-hover">
            {/* Rasm */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" unoptimized />
                {product.label && (
                    <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                        {product.label}
                    </span>
                )}
                {/* Savatga qo'shish tugmasi */}
                <button
                    onClick={handleAdd}
                    className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold shadow-lg transition-all duration-300 ${added
                        ? 'bg-green-500 text-white scale-105'
                        : 'bg-black text-white hover:bg-neutral-800 hover:scale-105'
                        }`}
                >
                    {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                    {added ? 'Qo\'shildi!' : 'Savatga'}
                </button>
                {/* Savatda borligini ko'rsatish */}
                {inCart && !added && (
                    <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg">
                        {inCart.quantity}
                    </span>
                )}
            </div>
            {/* Info */}
            <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3">
                <h3 className="truncate text-sm font-medium text-neutral-800 group-hover:text-black">{product.name}</h3>
                <span className="ml-2 flex-shrink-0 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {formatStorePrice(product.price)}
                </span>
            </div>
        </div>
    );
}

function StorePageContent() {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category') || 'Barchasi';
    const searchQuery = searchParams.get('q') || '';
    const [activeSort, setActiveSort] = useState('trending');
    const { products } = useProducts();

    const filtered = useMemo(() => {
        let items = [...products];
        // Qidiruv filtri
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter((p) =>
                p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
            );
        }
        // Kategoriya filtri
        if (activeCategory !== 'Barchasi' && !searchQuery) {
            items = items.filter((p) => p.category === activeCategory);
        }
        switch (activeSort) {
            case 'price_asc': items.sort((a, b) => a.price - b.price); break;
            case 'price_desc': items.sort((a, b) => b.price - a.price); break;
            case 'latest': items.reverse(); break;
        }
        return items;
    }, [activeCategory, activeSort, searchQuery, products]);

    return (
        <div className="flex gap-8">
            <div className="flex-1 min-w-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-lg text-neutral-500">
                            {searchQuery ? `"${searchQuery}" bo'yicha mahsulot topilmadi` : 'Bu turkumda mahsulot topilmadi'}
                        </p>
                    </div>
                )}
            </div>
            <aside className="hidden lg:block w-[160px] flex-shrink-0">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Saralash</h3>
                <ul className="space-y-1">
                    {sortOptions.map((opt) => (
                        <li key={opt.value}>
                            <button onClick={() => setActiveSort(opt.value)} className={`block w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${activeSort === opt.value ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'}`}>
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

export default function StorePage() {
    return (
        <Suspense>
            <StorePageContent />
        </Suspense>
    );
}
