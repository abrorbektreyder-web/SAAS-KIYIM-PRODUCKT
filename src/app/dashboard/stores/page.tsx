import { getStores, getOrgProfile, formatPrice } from '@/lib/data';
import StoresClient from './stores-client';

export default async function StoresPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const stores = await getStores(profile.organization_id);

    return <StoresClient initialStores={stores || []} orgId={profile.organization_id} />;
}
