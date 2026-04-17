import { supabaseAdmin } from '@/lib/supabase/admin';
import { 
    Building2, Store, CreditCard, Rocket, TrendingUp, 
    Activity, ArrowUpRight, Globe, ShieldCheck, Zap,
    Users, BarChart3, Clock, Sparkles, Orbit
} from 'lucide-react';
import { formatStorePrice } from '@/lib/store-data';
import RealTimeClock from '@/components/ui/real-time-clock';

// SAAS tarifi narxlari (taxminan)
const PLAN_PRICES: Record<string, number> = {
    starter: 150000,
    business: 300000,
    premium: 500000,
};

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
    // Tashkilotlarni bazadan olib kelish
    const { data: orgs, error } = await supabaseAdmin
        .from('organizations')
        .select('*');

    const totalOrgs = orgs ? orgs.length : 0;

    // Faol tashkilotlar (active yoki trialing)
    const activeOrgs = orgs ? orgs.filter(o => o.subscription_status === 'active' || o.subscription_status === 'trialing' || o.subscription_status === 'trial').length : 0;
    const activePercent = totalOrgs > 0 ? Math.round((activeOrgs / totalOrgs) * 100) : 0;

    // Bu oydagi yangi qo'shilganlar
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newOrgs = orgs ? orgs.filter(o => {
        const d = new Date(o.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length : 0;

    // Oylik daromad
    const monthlyRevenue = orgs ? orgs
        .filter(o => o.subscription_status === 'active')
        .reduce((sum, o) => {
            const plan = o.plan?.toLowerCase() || 'starter';
            return sum + (PLAN_PRICES[plan] || 0);
        }, 0) : 0;

    return (
        <div className="max-w-[1600px] mx-auto space-y-5 pb-8 animate-in fade-in duration-1000">
            {/* Header / Hero Section - ULTRA PRO */}
            <div className="relative overflow-hidden rounded-[32px] border border-neutral-800/50 bg-[#09090b] p-8 shadow-2xl group">
                {/* Fantasy WOW Effect: Pulse Radar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20">
                    <div className="absolute inset-0 border border-red-500/10 rounded-full animate-[ping_10s_linear_infinite]" />
                    <div className="absolute inset-[100px] border border-red-500/5 rounded-full animate-[ping_15s_linear_infinite]" />
                    <div className="absolute inset-[200px] border border-red-500/5 rounded-full animate-[ping_20s_linear_infinite]" />
                </div>

                <div className="absolute top-[-20%] right-[-5%] w-[300px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-600/20 transition-colors duration-1000" />
                
                <div className="relative z-10 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        {/* System Core Icon */}
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 bg-red-600/20 blur-[20px] rounded-full animate-pulse" />
                            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:rotate-[360deg] transition-transform duration-1000">
                                <Orbit className="w-8 h-8 text-white animate-[spin_8s_linear_infinite]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest">
                                    Core System v2.1
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    ENCRYPTED
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                                Platforma <span className="text-neutral-500">Holati</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center gap-4 px-6 border-l border-neutral-800/50 py-2">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest leading-none">Uptime</p>
                                <p className="text-sm font-black text-emerald-500 mt-1">99.98%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest leading-none">Latency</p>
                                <p className="text-sm font-black text-red-500 mt-1">12ms</p>
                            </div>
                        </div>
                        <RealTimeClock />
                    </div>
                </div>
            </div>

            {/* Main Content Grid - Tighter Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-5">
                <div className="space-y-5">
                    {/* KPI Cards - Dense */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Do\'konlar', value: totalOrgs, sub: 'Jami', icon: Building2, color: 'red' },
                            { label: 'Faollik', value: `${activePercent}%`, sub: `${activeOrgs} ta faol`, icon: Globe, color: 'emerald' },
                            { label: 'Daromad', value: formatStorePrice(monthlyRevenue), sub: 'Oylik', icon: CreditCard, color: 'amber' },
                            { label: 'Yangi', value: newOrgs, sub: 'Bu oy', icon: Rocket, color: 'blue' },
                        ].map((kpi, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-neutral-800/50 bg-[#09090b] p-5 hover:border-neutral-700 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-lg bg-neutral-900 border border-neutral-800`}>
                                        <kpi.icon className={`w-4 h-4 text-${kpi.color}-500`} />
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-800 group-hover:text-neutral-500 transition-colors" />
                                </div>
                                <div className="mt-3">
                                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{kpi.label}</p>
                                    <h3 className="text-xl font-black text-white tracking-tighter mt-0.5">{kpi.value}</h3>
                                    <p className={`text-[8px] font-bold text-neutral-600 uppercase tracking-wide mt-1`}>{kpi.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Latest Organizations - High Density List */}
                    <div className="bg-[#09090b] border border-neutral-800/50 rounded-[24px] p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-red-500" />
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">So'nggi Tashkilotlar</h3>
                            </div>
                            <Sparkles className="w-4 h-4 text-neutral-800" />
                        </div>

                        <div className="space-y-1">
                            {orgs && orgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).map((org) => (
                                <div key={org.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-900/40 transition-all border border-transparent hover:border-neutral-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-[10px] text-neutral-600 group-hover:text-red-500 transition-colors">
                                            {org.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-xs tracking-tight">{org.name}</p>
                                            <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">
                                                {new Date(org.created_at).toLocaleDateString('uz-UZ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                        org.subscription_status === 'active' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {org.subscription_status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Compact Side Stats */}
                <div className="space-y-5">
                    <div className="bg-[#09090b] border border-neutral-800/50 rounded-[24px] p-6 shadow-xl h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-4 h-4 text-amber-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Moliyaviy Oqim</h3>
                        </div>

                        <div className="space-y-5">
                            {orgs && orgs.filter(o => o.subscription_status === 'active').sort((a, b) => {
                                if (!a.subscription_ends_at || !b.subscription_ends_at) return -1;
                                return new Date(b.subscription_ends_at).getTime() - new Date(a.subscription_ends_at).getTime()
                            }).slice(0, 6).map((org) => (
                                <div key={org.id} className="relative pl-5 border-l border-neutral-800 pb-5 last:pb-0">
                                    <div className="absolute top-0 left-[-4.5px] w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                                    <div className="space-y-1">
                                        <p className="font-black text-white text-[11px] tracking-tight leading-none">{org.name}</p>
                                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">
                                            {org.plan} • {formatStorePrice(PLAN_PRICES[org.plan?.toLowerCase() || 'starter'])}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - System Health Small */}
            <div className="bg-[#09090b] border border-neutral-800/50 rounded-[24px] p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-red-500" />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">System Health</h3>
                    </div>
                    
                    <div className="flex-1 max-w-xl grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-black text-neutral-500 uppercase tracking-widest">
                                <span>Stability</span>
                                <span className="text-emerald-500">99.9%</span>
                            </div>
                            <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[99.9%]" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-black text-neutral-500 uppercase tracking-widest">
                                <span>Sync</span>
                                <span className="text-red-500">45ms</span>
                            </div>
                            <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[85%]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[8px] font-black text-white uppercase">Elite Protection</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
