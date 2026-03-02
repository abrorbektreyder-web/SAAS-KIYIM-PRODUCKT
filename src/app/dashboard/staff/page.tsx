import { getOrgProfile, getStores } from '@/lib/data';
import StaffClient from './staff-client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StaffPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    // Server-side ma'lumot olish
    const stores = await getStores(profile.organization_id);

    // Kassirlarni olish
    const { data: staff } = await supabaseAdmin
        .from('profiles')
        .select(`
            id,
            full_name,
            role,
            store_id,
            stores ( name )
        `)
        .eq('organization_id', profile.organization_id)
        .eq('role', 'cashier')
        .order('created_at', { ascending: false });

    // Authdan foydalanuvchilar login va parollarini olish
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers();

    let enrichedStaff = staff || [];

    if (authData?.users && staff) {
        enrichedStaff = staff.map(employee => {
            const authUser = authData.users.find(u => u.id === employee.id);
            return {
                ...employee,
                email: authUser?.email || '',
                plain_password: authUser?.user_metadata?.plain_password || '',
            };
        });
    }

    return (
        <StaffClient
            staff={enrichedStaff}
            stores={stores || []}
            orgId={profile.organization_id}
        />
    );
}
