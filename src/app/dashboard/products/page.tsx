import { getProducts, getOrgProfile } from '@/lib/data';
import ProductsClient from './products-client';

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const { page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 20;

    const { products, totalCount } = await getProducts(profile.organization_id, currentPage, pageSize);

    return (
        <ProductsClient 
            products={products} 
            orgId={profile.organization_id} 
            totalCount={totalCount} 
            currentPage={currentPage}
            pageSize={pageSize}
        />
    );
}
