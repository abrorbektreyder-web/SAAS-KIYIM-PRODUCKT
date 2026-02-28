import { getOrgProfile, getStores } from '@/lib/data';
import StaffClient from './staff-client';
import { supabaseAdmin } from '@/lib/supabase/admin';

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
            phone,
            role,
            store_id,
            stores ( name )
        `)
        .eq('organization_id', profile.organization_id)
        .eq('role', 'cashier')
        .order('created_at', { ascending: false });

    return (
        <StaffClient
            staff={staff || []}
            stores={stores || []}
            orgId={profile.organization_id}
        />
    );
}
