'use client';

import Link from 'next/link';
import { Search, ShoppingCart, LogOut, Package, LayoutGrid, Menu, X } from 'lucide-react';
import HoyrLogo from '@/components/ui/hoyr-logo';
import { storeCategories } from '@/lib/store-data';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useState, useCallback, useEffect } from 'react';
import { CartProvider, useCart } from '@/lib/cart-context';
import { ProductProvider, useProducts } from '@/lib/product-context';
import CartModal from '@/components/store/cart-modal';
import { signOut } from '@/lib/supabase/auth';

function CartButton({ orgId, storeId }: { orgId: string; storeId: string }) {
    const { totalItems } = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    return (
        <>
            <button onClick={() => setCartOpen(true)} className="relative flex-shrink-0 rounded-lg border border-neutral-700 p-1.5 sm:p-2 text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {totalItems > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-blue-500 text-[9px] sm:text-[10px] font-bold text-white animate-fade-in">{totalItems}</span>
                )}
            </button>
            <CartModal open={cartOpen} onClose={() => setCartOpen(false)} orgId={orgId} storeId={storeId} />
        </>
    );
}

import BarcodeScanner from './components/barcode-scanner';

function StoreNavContent({ orgId, storeId, onMenuClick }: { orgId: string; storeId: string; onMenuClick: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
    const [scannerOpen, setScannerOpen] = useState(false);
    const firstThree = storeCategories.slice(1, 4);

    const handleSearch = useCallback((e?: React.FormEvent, value?: string) => {
        if (e) e.preventDefault();
        const query = value !== undefined ? value : searchValue;
        router.push(query.trim() ? `/store?q=${encodeURIComponent(query.trim())}` : '/store');
    }, [searchValue, router]);

    const onScan = (code: string) => {
        setSearchValue(code);
        handleSearch(undefined, code);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-2 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-6">
                    <button onClick={onMenuClick} className="md:hidden p-1.5 text-neutral-400 hover:text-white transition-colors">
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <Link href="/store" className="hidden sm:block"><HoyrLogo size="sm" /></Link>
                    <nav className="hidden md:flex items-center gap-4">
                        {firstThree.map((cat) => (
                            <Link key={cat} href={`/store?category=${encodeURIComponent(cat)}`} className="text-sm text-neutral-400 hover:text-white transition-colors">{cat}</Link>
                        ))}
                    </nav>
                </div>
                <div className="flex-1 max-w-md mx-2 sm:mx-4 relative flex items-center gap-1 sm:gap-2">
                    <form onSubmit={(e) => handleSearch(e)} className="relative flex-1">
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-neutral-500" />
                        <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Shtrix-kod..."
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-1.5 sm:py-2 pl-7 sm:pl-9 pr-14 sm:pr-24 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none transition-colors" />
                        <button type="submit" className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-neutral-700 px-2 sm:px-3 py-1 sm:py-1 text-[10px] sm:text-xs font-medium text-white hover:bg-neutral-600 transition-colors">Izlash</button>
                    </form>
                    <button
                        onClick={() => setScannerOpen(true)}
                        className="flex-shrink-0 flex items-center justify-center p-1.5 sm:p-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
                        title="Shtrix-kod skanerlash"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4M4 4h16v16H4V4z" />
                            <path d="M4 7V4h3M17 4h3v3M4 17v3h3M17 20h3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 8h2v8H7zm4 0h1v8h-1zm3 0h3v8h-3z" fill="currentColor" />
                        </svg>
                    </button>
                    {scannerOpen && (
                        <BarcodeScanner
                            onDetect={onScan}
                            onClose={() => setScannerOpen(false)}
                        />
                    )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <CartButton orgId={orgId} storeId={storeId} />
                    <Link href="/login" className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-neutral-700 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-sm text-neutral-400 hover:border-red-800 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" /><span className="hidden sm:inline">Chiqish</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

function ProductsBadge() {
    const { totalProducts } = useProducts();
    return (
        <span className="ml-auto rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-300">{totalProducts}</span>
    );
}

function StoreLayoutInner({ children, orgId, storeId }: { children: React.ReactNode; orgId: string; storeId: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const activeCategory = searchParams.get('category') || 'Barchasi';
    const isProductsPage = pathname === '/store/products';
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname, searchParams]);

    return (
        <div className="min-h-screen bg-[#09090b]">
            <StoreNavContent orgId={orgId} storeId={storeId} onMenuClick={() => setSidebarOpen(true)} />
            <div className="mx-auto max-w-7xl px-4 py-6 relative">

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <div className="flex gap-8">
                    {/* Sidebar Drawer / Desktop Aside */}
                    <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 overflow-y-auto bg-neutral-950 border-r border-neutral-800 p-6 shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-transparent md:border-none md:p-0 md:w-[170px] md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                        {/* Mobile Header in Drawer */}
                        <div className="flex items-center justify-between mb-8 md:hidden">
                            <HoyrLogo size="sm" />
                            <button onClick={() => setSidebarOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Boshqaruv bo'limi */}
                        <div className="mb-8 md:mb-6">
                            <h3 className="mb-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-neutral-500">Boshqaruv</h3>
                            <ul className="space-y-1">
                                <li>
                                    <Link href="/store"
                                        className={`flex items-center gap-2 rounded-md px-3 md:px-2 py-2.5 md:py-2 text-sm transition-colors ${!isProductsPage ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}>
                                        <LayoutGrid className="h-4 w-4" />
                                        Vitrina
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/store/products"
                                        className={`flex items-center gap-2 rounded-md px-3 md:px-2 py-2.5 md:py-2 text-sm transition-colors ${isProductsPage ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}>
                                        <Package className="h-4 w-4" />
                                        Mahsulotlar
                                        <ProductsBadge />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Turkumlar */}
                        {!isProductsPage && (
                            <div>
                                <h3 className="mb-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-neutral-500">Turkumlar</h3>
                                <ul className="space-y-1">
                                    {storeCategories.map((cat) => (
                                        <li key={cat}>
                                            <Link href={cat === 'Barchasi' ? '/store' : `/store?category=${encodeURIComponent(cat)}`}
                                                className={`block rounded-md px-3 md:px-2 py-2.5 md:py-1.5 text-sm transition-colors ${activeCategory === cat ? 'bg-neutral-800 md:bg-transparent text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 md:hover:bg-transparent'}`}>
                                                {cat}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tizimdan chiqish */}
                        <div className="mt-8 pt-8 border-t border-neutral-800">
                            <button
                                onClick={async () => {
                                    await signOut();
                                    window.location.href = '/login';
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 md:px-2 py-2.5 md:py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Tizimdan chiqish
                            </button>
                        </div>
                    </aside>
                    <div className="flex-1 min-w-0">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default function StoreLayoutClient({ children, initialProducts, orgId, storeId }: { children: React.ReactNode; initialProducts: any[]; orgId: string; storeId: string }) {
    return (
        <ProductProvider initialProducts={initialProducts}>
            <CartProvider>
                <Suspense>
                    <StoreLayoutInner orgId={orgId} storeId={storeId}>{children}</StoreLayoutInner>
                </Suspense>
            </CartProvider>
        </ProductProvider>
    );
}
