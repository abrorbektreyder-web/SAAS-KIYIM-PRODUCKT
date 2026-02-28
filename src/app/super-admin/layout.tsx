import Link from 'next/link';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    LineChart,
    Settings,
    LogOut
} from 'lucide-react';
import HoyrLogo from '@/components/ui/hoyr-logo';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#09090b] text-white">
            {/* Sidebar */}
            <aside className="w-64 flex-col border-r border-neutral-800 bg-neutral-900/50 flex">
                <div className="p-6 border-b border-neutral-800">
                    <HoyrLogo size="sm" />
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mt-2">Super Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/super-admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 text-sm transition-colors text-neutral-300 hover:text-white">
                        <LayoutDashboard className="w-4 h-4 text-red-400" />
                        Bosh panel
                    </Link>
                    <Link href="/super-admin/organizations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 text-sm transition-colors text-neutral-300 hover:text-white">
                        <Building2 className="w-4 h-4 text-red-400" />
                        Tashkilotlar
                    </Link>
                    <Link href="/super-admin/subscriptions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 text-sm transition-colors text-neutral-300 hover:text-white">
                        <CreditCard className="w-4 h-4 text-red-400" />
                        Obunalar
                    </Link>
                    <Link href="/super-admin/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 text-sm transition-colors text-neutral-300 hover:text-white">
                        <LineChart className="w-4 h-4 text-red-400" />
                        Analitika
                    </Link>
                    <Link href="/super-admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 text-sm transition-colors text-neutral-300 hover:text-white">
                        <Settings className="w-4 h-4 text-red-400" />
                        Sozlamalar
                    </Link>
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm transition-colors text-red-400">
                        <LogOut className="w-4 h-4" />
                        Tizimdan chiqish
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b border-neutral-800 bg-neutral-900/30 flex items-center justify-between px-8">
                    <h1 className="text-sm font-medium text-neutral-300">HOYR Platformasi Boshqaruvi</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs ring-1 ring-red-500/50">SA</div>
                    </div>
                </header>
                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
