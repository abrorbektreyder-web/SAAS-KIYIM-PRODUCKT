import { supabaseAdmin } from '@/lib/supabase/admin';
import { Building2, Store, CreditCard, Rocket, TrendingUp } from 'lucide-react';
import { formatStorePrice } from '@/lib/store-data';

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

    // Oylik daromad - Faqat "active" statusdagi tashkilotlarning tariflarini hisoblaymiz. "trial" (bepul) yoki "blocked" bo'lsa daromad keltirmaydi.
    const monthlyRevenue = orgs ? orgs
        .filter(o => o.subscription_status === 'active')
        .reduce((sum, o) => {
            const plan = o.plan?.toLowerCase() || 'starter';
            return sum + (PLAN_PRICES[plan] || 0);
        }, 0) : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-semibold text-white">Super Admin Paneli</h1>
                <p className="text-sm text-neutral-400 mt-1">Platforma holati bo'yicha real ko'rsatkichlar</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Jami do'konlar</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{totalOrgs}</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <span>Tizimda</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 2 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Faol do'konlar</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{activeOrgs}</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <span>{activePercent}% umumiy</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Store className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 3 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Oylik daromad</p>
                            <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{formatStorePrice(monthlyRevenue)}</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <span>Joriy to'lovlardan</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <CreditCard className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 4 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Yangi (bu oy)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{newOrgs}</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <span>Platformaga qo'shilgan</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Rocket className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">So'nggi a'zo bo'lgan do'konlar</h3>
                    <div className="space-y-4">
                        {orgs && orgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).map(org => (
                            <div key={org.id} className="flex items-center justify-between pb-4 border-b border-neutral-800/50 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-white">{org.name}</p>
                                    <p className="text-xs text-neutral-500">{new Date(org.created_at).toLocaleDateString('uz-UZ')}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${org.subscription_status === 'blocked' ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                                        : org.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'}`}>
                                    {org.subscription_status}
                                </span>
                            </div>
                        ))}
                        {(!orgs || orgs.length === 0) && (
                            <p className="text-sm text-neutral-500 text-center py-4">Hozircha ma'lumot yo'q</p>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Eng so'nggi to'lovlar va holat</h3>
                    <div className="space-y-4">
                        {orgs && orgs.filter(o => o.subscription_status === 'active').sort((a, b) => {
                            if (!a.subscription_ends_at || !b.subscription_ends_at) return -1;
                            return new Date(b.subscription_ends_at).getTime() - new Date(a.subscription_ends_at).getTime()
                        }).slice(0, 5).map(org => (
                            <div key={org.id} className="flex items-center justify-between pb-4 border-b border-neutral-800/50 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-white">{org.name}</p>
                                    <p className="text-xs text-neutral-500 uppercase">{org.plan} ({formatStorePrice(PLAN_PRICES[org.plan?.toLowerCase() || 'starter'])})</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-emerald-400">To'langan</p>
                                    <p className="text-xs text-neutral-500">
                                        Qadar: {org.subscription_ends_at ? new Date(org.subscription_ends_at).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!orgs || orgs.filter(o => o.subscription_status === 'active').length === 0) && (
                            <p className="text-sm text-neutral-500 text-center py-4">Hozircha faol to'lovlar mavjud emas</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
