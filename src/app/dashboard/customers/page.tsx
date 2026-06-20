import { getCustomers, getOrgProfile } from '@/lib/data';
import CustomersClient from './customers-client';

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
    const { customers, totalCount } = await getCustomers(profile.organization_id, page, 50);

    return <CustomersClient 
                customers={customers} 
                orgId={profile.organization_id} 
                totalCount={totalCount}
                currentPage={page}
            />;
}
