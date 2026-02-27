'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Store,
    Package,
    ShoppingCart,
    Users,
    Warehouse,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { stores } from '@/lib/data';
import clsx from 'clsx';
import HoyrLogo from '@/components/ui/hoyr-logo';

const navItems = [
    { href: '/dashboard', label: 'Bosh panel', icon: LayoutDashboard },
    { href: '/stores', label: 'Do\'konlar', icon: Store },
    { href: '/products', label: 'Mahsulotlar', icon: Package },
    { href: '/orders', label: 'Buyurtmalar', icon: ShoppingCart },
    { href: '/customers', label: 'Mijozlar', icon: Users },
    { href: '/inventory', label: 'Ombor', icon: Warehouse },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [selectedStore, setSelectedStore] = useState(stores[0]);
    const [storeOpen, setStoreOpen] = useState(false);

    return (
        <aside className="flex h-screen w-[220px] flex-col border-r border-neutral-800 bg-black">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-neutral-800 px-4">
                <HoyrLogo size="sm" />
            </div>

            {/* Do'kon tanlash */}
            <div className="relative px-3 py-3 border-b border-neutral-800">
                <button
                    onClick={() => setStoreOpen(!storeOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 transition-colors"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="truncate">{selectedStore.name}</span>
                    </div>
                    <ChevronDown className={clsx('h-4 w-4 flex-shrink-0 transition-transform', storeOpen && 'rotate-180')} />
                </button>

                {storeOpen && (
                    <div className="absolute left-3 right-3 top-full z-50 mt-1 rounded-lg border border-neutral-800 bg-neutral-900 py-1 shadow-2xl">
                        {stores.map((store) => (
                            <button
                                key={store.id}
                                onClick={() => { setSelectedStore(store); setStoreOpen(false); }}
                                className={clsx(
                                    'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-800',
                                    selectedStore.id === store.id ? 'text-white' : 'text-neutral-400'
                                )}
                            >
                                <div className={clsx('h-2 w-2 rounded-full flex-shrink-0', store.status === 'faol' ? 'bg-green-400' : 'bg-neutral-600')} />
                                <span className="truncate">{store.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigatsiya */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        'nav-active flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                                    )}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Pastki qism - Chiqish */}
            <div className="border-t border-neutral-800 p-3">
                <div className="mb-2 px-3 py-2">
                    <p className="text-xs font-medium text-white">Admin</p>
                    <p className="text-xs text-neutral-500">admin@hoyr.uz</p>
                </div>
                <Link
                    href="/login/admin"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-red-400 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Chiqish
                </Link>
            </div>
        </aside>
    );
}
