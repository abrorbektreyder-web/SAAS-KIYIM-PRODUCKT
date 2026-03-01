import { getOrganization, getOrgProfile, getStoreProducts } from '@/lib/data';
import StoreLayoutClient from './store-layout-client';
import { redirect } from 'next/navigation';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
    const profile = await getOrgProfile();

    if (!profile) {
        redirect('/login');
    }

    if (profile.role !== 'cashier') {
        // Kassir bo'lmasa, uni admin panelga yo'naltiramiz
        redirect('/dashboard');
    }

    if (!profile.organization_id || !profile.store_id) {
        return <div className="p-8 text-neutral-400">Do'koningizga biriktirilmagansiz yoki tashkilot topilmadi.</div>;
    }

    const org = await getOrganization(profile.organization_id);
    if (org && (org.subscription_status === 'expired' || org.subscription_status === 'blocked')) {
        redirect('/subscription-expired');
    }

    // Kassir o'ziga biriktirilgan do'kon mahsulotlarini oladi
    const rawProducts = await getStoreProducts(profile.organization_id, profile.store_id);

    // Context uchun formatlashtirish
    const initialProducts = rawProducts.map((p: any) => {
        let meta = { category: p.categories?.name || 'Boshqa', label: '' };
        if (p.barcode) {
            try { meta = JSON.parse(p.barcode); } catch (e) { }
        }
        return {
            id: p.id,
            name: p.name,
            category: meta.category,
            price: p.price,
            image: p.sku || '/no-image.svg',
            label: meta.label,
            quantity: p.inventory?.[0]?.stock || 0,
            sizes: p.sizes,
            colors: p.colors
        };
    });

    return (
        <StoreLayoutClient initialProducts={initialProducts} orgId={profile.organization_id} storeId={profile.store_id}>
            {children}
        </StoreLayoutClient>
    );
}
