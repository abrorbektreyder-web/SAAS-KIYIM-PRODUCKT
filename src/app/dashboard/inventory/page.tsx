import { getProducts, getOrgProfile } from '@/lib/data';
import InventoryClient from './inventory-client';


export default async function InventoryPage({
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
    const pageSize = 100; // Load 100 items for inventory view to make bulk edits easier

    const { products, totalCount } = await getProducts(profile.organization_id, currentPage, pageSize);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Ombor</h1>
                <p className="text-sm text-neutral-500">Mahsulotlar qoldig'ini kuzatish</p>
            </div>

            <InventoryClient products={products} />
        </div>
    );
}
