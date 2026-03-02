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
        redirect('/login/admin');
    }

    const profile = await getOrgProfile();

    if (profile?.organization_id) {
        const org = await getOrganization(profile.organization_id);
        if (org && (org.subscription_status === 'expired' || org.subscription_status === 'blocked')) {
            redirect('/subscription-expired');
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#09090b]">
            <Sidebar
                userEmail={user.email || 'Noma\'lum email'}
                userName={profile?.full_name || 'Admin'}
            />
            <div className="flex flex-1 flex-col overflow-hidden relative w-full">
                {/* lg:mt-0 lg:p-6 is for desktop, pt-20 p-4 is for mobile (padding top 20 to avoid hidden content under the mobile header) */}
                <main className="flex-1 overflow-y-auto p-4 pt-20 lg:p-6 lg:pt-6 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
