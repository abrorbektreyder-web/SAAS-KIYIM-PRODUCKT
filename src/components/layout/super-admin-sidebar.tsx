'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    LineChart,
    Settings,
    LogOut,
    ShieldCheck,
    Cpu,
    Zap
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
        <aside className="w-64 flex flex-col border-r border-neutral-800/50 bg-[#09090b] h-screen sticky top-0 overflow-hidden">
            {/* Logo Section - Fixed */}
            <div className="p-7 flex-shrink-0">
                <HoyrLogo size="sm" />
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] block">Super Admin</span>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-6 pb-6">
                <nav className="space-y-1.5">
                    {[
                        { label: 'Bosh panel', icon: LayoutDashboard, href: '/super-admin' },
                        { label: 'Tashkilotlar', icon: Building2, href: '/super-admin/organizations' },
                        { label: 'Obunalar', icon: CreditCard, href: '/super-admin/subscriptions' },
                        { label: 'Analitika', icon: LineChart, href: '/super-admin/analytics' },
                        { label: 'Sozlamalar', icon: Settings, href: '/super-admin/settings' },
                    ].map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/super-admin' && pathname.startsWith(item.href));
                        return (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-red-500/5 text-white border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]' 
                                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-neutral-600 group-hover:text-red-400'}`} />
                                    <span className={`font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {isActive && <div className="w-1 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Elite Guard Widget */}
                <div className="px-2">
                    <div className="relative overflow-hidden rounded-[24px] border border-neutral-800/50 bg-neutral-900/30 p-5 group">
                        <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-red-600/10 blur-[30px] rounded-full group-hover:bg-red-600/20 transition-colors duration-500" />
                        
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500 uppercase">Secure</span>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Elite Guard</p>
                                <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-tight mt-1 leading-relaxed">
                                    Tizim 24/7 himoya ostida.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <div className="flex -space-x-1.5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-4 h-4 rounded-full border border-neutral-900 bg-neutral-800 flex items-center justify-center">
                                            <div className="w-1 h-1 rounded-full bg-red-500/50" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">128-bit Enc</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Section - Fixed at Bottom */}
            <div className="p-4 px-6 border-t border-neutral-800/50 flex-shrink-0 bg-[#09090b]">
                <button 
                    onClick={handleLogout} 
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-xs transition-all group text-neutral-500 hover:text-red-400"
                >
                    <LogOut className="w-4 h-4 text-neutral-600 group-hover:text-red-500 transition-colors" />
                    <span className="font-black uppercase tracking-widest">Chiqish</span>
                </button>
            </div>
        </aside>
    );
}
