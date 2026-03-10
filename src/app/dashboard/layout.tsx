import Sidebar from '@/components/layout/sidebar';
import { getOrganization, getOrgProfile } from '@/lib/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Session tokeni va routerni himoya qilish
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin');
    }

    const profile = await getOrgProfile();

    let trialDaysRemaining = null;
    let isTrialExpired = false;

    if (profile?.organization_id) {
        const org = await getOrganization(profile.organization_id);

        if (org) {
            // Trial muddatini tekshirish
            if (org.trial_ends_at && (org.subscription_status === 'trialing' || org.subscription_status === 'trial')) {
                const now = new Date();
                const endsAt = new Date(org.trial_ends_at);
                const diffTime = endsAt.getTime() - now.getTime();
                trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (trialDaysRemaining <= 0) {
                    isTrialExpired = true;
                }
            }

            if (org.subscription_status === 'expired' || org.subscription_status === 'blocked' || isTrialExpired) {
                redirect('/subscription-expired');
            }
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#09090b]">
            <Sidebar
                userEmail={user.email || 'Noma\'lum email'}
                userName={profile?.full_name || 'Admin'}
            />
            <div className="flex flex-1 flex-col overflow-hidden relative w-full">
                {trialDaysRemaining !== null && trialDaysRemaining > 0 && trialDaysRemaining <= 3 && (
                    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 w-full text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 z-10 shrink-0">
                        <span className="text-amber-500 text-sm font-semibold">
                            ⚠️ Diqqat: Bepul sinov muddati tugashiga {trialDaysRemaining} kun qoldi!
                        </span>
                        <span className="text-amber-400/80 text-xs hidden sm:inline">
                            Biz bilan ishlashda davom etib biznesingizni yanada o'stiring. Obuna bo'lishni unutmang.
                        </span>
                    </div>
                )}
                {/* lg:mt-0 lg:p-6 is for desktop, pt-20 p-4 is for mobile (padding top 20 to avoid hidden content under the mobile header) */}
                <main className="flex-1 overflow-y-auto p-4 pt-20 lg:p-6 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
