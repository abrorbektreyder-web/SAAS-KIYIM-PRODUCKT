import { getProducts, getOrgProfile, formatPrice } from '@/lib/data';
import ProductsClient from './products-client';

export default async function ProductsPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const products = await getProducts(profile.organization_id);

    return <ProductsClient products={products} orgId={profile.organization_id} formatPrice={formatPrice} />;
}
