'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    LineChart,
    Settings,
    LogOut
} from 'lucide-react';
import HoyrLogo from '@/components/ui/hoyr-logo';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SuperAdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await supabase.auth.signOut();
        router.push('/super');
    };

    return (
        <aside className="w-64 flex-col border-r border-neutral-800 bg-neutral-900/50 flex">
            <div className="p-6 border-b border-neutral-800">
                <HoyrLogo size="sm" />
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mt-2">Super Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link href="/super-admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/super-admin' ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
                    <LayoutDashboard className={`w-4 h-4 ${pathname === '/super-admin' ? '' : 'text-red-400'}`} />
                    Bosh panel
                </Link>
                <Link href="/super-admin/organizations" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith('/super-admin/organizations') ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
                    <Building2 className={`w-4 h-4 ${pathname.startsWith('/super-admin/organizations') ? '' : 'text-red-400'}`} />
                    Tashkilotlar
                </Link>
                <Link href="/super-admin/subscriptions" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith('/super-admin/subscriptions') ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
                    <CreditCard className={`w-4 h-4 ${pathname.startsWith('/super-admin/subscriptions') ? '' : 'text-red-400'}`} />
                    Obunalar
                </Link>
                <Link href="/super-admin/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith('/super-admin/analytics') ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
                    <LineChart className={`w-4 h-4 ${pathname.startsWith('/super-admin/analytics') ? '' : 'text-red-400'}`} />
                    Analitika
                </Link>
                <Link href="/super-admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith('/super-admin/settings') ? 'bg-red-500/10 text-red-500 font-medium border border-red-500/20' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
                    <Settings className={`w-4 h-4 ${pathname.startsWith('/super-admin/settings') ? '' : 'text-red-400'}`} />
                    Sozlamalar
                </Link>
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm transition-colors text-red-400">
                    <LogOut className="w-4 h-4" />
                    Tizimdan chiqish
                </button>
            </div>
        </aside>
    );
}
