import { getOrganization, getOrgProfile, getStoreProducts } from '@/lib/data';
import StoreLayoutClient from './store-layout-client';
import { redirect } from 'next/navigation';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
    const profile = await getOrgProfile();

    if (!profile) {
        redirect('/pos');
    }

    if (profile.role !== 'cashier') {
        // Kassir bo'lmasa, uni admin panelga yo'naltiramiz
        redirect('/dashboard');
    }

    if (!profile.organization_id || !profile.store_id) {
        return <div className="p-8 text-neutral-400">Do'koningizga biriktirilmagansiz yoki tashkilot topilmadi.</div>;
    }

    let isTrialExpired = false;

    if (profile.organization_id) {
        const org = await getOrganization(profile.organization_id);

        if (org) {
            // Trial muddatini tekshirish
            if (org.trial_ends_at && (org.subscription_status === 'trialing' || org.subscription_status === 'trial')) {
                const now = new Date();
                const endsAt = new Date(org.trial_ends_at);
                const diffTime = endsAt.getTime() - now.getTime();
                const trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (trialDaysRemaining <= 0) {
                    isTrialExpired = true;
                }
            }

            if (org.subscription_status === 'expired' || org.subscription_status === 'blocked' || isTrialExpired) {
                redirect('/subscription-expired');
            }
        }
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
