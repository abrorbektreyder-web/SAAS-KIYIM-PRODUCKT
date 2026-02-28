import { getCustomers, getOrgProfile } from '@/lib/data';
import CustomersClient from './customers-client';

export default async function CustomersPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const customers = await getCustomers(profile.organization_id);

    return <CustomersClient customers={customers} orgId={profile.organization_id} />;
}
