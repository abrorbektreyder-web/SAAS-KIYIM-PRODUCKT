'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Store,
    Package,
    ShoppingCart,
    Users,
    UserCog,
    LineChart,
    Warehouse,
    LogOut,
    Settings,
    Menu,
    X
} from 'lucide-react';
import clsx from 'clsx';
import HoyrLogo from '@/components/ui/hoyr-logo';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Bosh panel', icon: LayoutDashboard },
    { href: '/dashboard/stores', label: 'Filiallar', icon: Store },
    { href: '/dashboard/products', label: 'Mahsulotlar', icon: Package },
    { href: '/dashboard/orders', label: 'Buyurtmalar', icon: ShoppingCart },
    { href: '/dashboard/customers', label: 'Mijozlar', icon: Users },
    { href: '/dashboard/staff', label: 'Xodimlar', icon: UserCog },
    { href: '/dashboard/analytics', label: 'Analitika', icon: LineChart },
    { href: '/dashboard/inventory', label: 'Ombor', icon: Warehouse },
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: Settings },
];

export default function Sidebar({ userEmail, userName }: { userEmail?: string, userName?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);

    // Rout o'zgarganda mobil menyuni yopish
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await supabase.auth.signOut();
        router.push('/login/admin');
    };

    return (
        <>
            {/* Mobil qism uchun Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-neutral-800 z-40 flex items-center justify-between px-4">
                <HoyrLogo size="sm" />
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Qoraytirilgan orqa fon (Mobil) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Asosiy Sidebar */}
            <aside className={clsx(
                'fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] lg:w-[220px] flex-col border-r border-neutral-800 bg-black transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Logo va yopish tugmasi */}
                <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
                    <HoyrLogo size="sm" />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-neutral-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigatsiya */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            'nav-active flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-red-500/10 text-red-400'
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
                        <p className="text-xs font-medium text-white line-clamp-1">{userName || 'Admin'}</p>
                        <p className="text-[10px] text-neutral-500 line-clamp-1">{userEmail || 'admin@hoyr.uz'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Chiqish
                    </button>
                </div>
            </aside>
        </>
    );
}
