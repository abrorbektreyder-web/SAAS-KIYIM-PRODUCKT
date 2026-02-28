'use client';

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
} from 'lucide-react';
import clsx from 'clsx';
import HoyrLogo from '@/components/ui/hoyr-logo';

const navItems = [
    { href: '/dashboard', label: 'Bosh panel', icon: LayoutDashboard },
    { href: '/dashboard/stores', label: 'Filiallar', icon: Store },
    { href: '/dashboard/products', label: 'Mahsulotlar', icon: Package },
    { href: '/dashboard/orders', label: 'Buyurtmalar', icon: ShoppingCart },
    { href: '/dashboard/customers', label: 'Mijozlar', icon: Users },
    { href: '/dashboard/staff', label: 'Xodimlar', icon: UserCog },
    { href: '/dashboard/analytics', label: 'Analitika', icon: LineChart },
    { href: '/dashboard/inventory', label: 'Ombor', icon: Warehouse },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-[220px] flex-col border-r border-neutral-800 bg-black">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-neutral-800 px-4">
                <HoyrLogo size="sm" />
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
