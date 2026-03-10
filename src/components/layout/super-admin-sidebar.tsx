'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    LineChart,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import clsx from 'clsx';
import HoyrLogo from '@/components/ui/hoyr-logo';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/super-admin', label: 'Bosh panel', icon: LayoutDashboard },
    { href: '/super-admin/organizations', label: 'Tashkilotlar', icon: Building2 },
    { href: '/super-admin/subscriptions', label: 'Obunalar', icon: CreditCard },
    { href: '/super-admin/analytics', label: 'Analitika', icon: LineChart },
    { href: '/super-admin/settings', label: 'Sozlamalar', icon: Settings },
];

export default function SuperAdminSidebar() {
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
        router.push('/super');
    };

    return (
        <>
            {/* Mobil qism uchun Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b] border-b border-neutral-800 z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <HoyrLogo size="sm" />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">SA</span>
                </div>
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
                'fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] lg:w-[260px] flex-col border-r border-neutral-800 bg-[#09090b] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Logo va yopish tugmasi */}
                <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-6 lg:justify-start lg:gap-3">
                    <HoyrLogo size="sm" />
                    <span className="hidden lg:block text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">SA</span>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-neutral-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigatsiya */}
                <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/super-admin' && pathname.startsWith(item.href + '/'));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                                    isActive
                                        ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20'
                                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Pastki qism - Chiqish */}
                <div className="p-4 border-t border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm transition-colors text-red-400/80 hover:text-red-400 font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Tizimdan chiqish
                    </button>
                </div>
            </aside>
        </>
    );
}
