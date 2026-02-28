import { getOrgProfile, getStoreProducts } from '@/lib/data';
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

    // Kassir o'ziga biriktirilgan do'kon mahsulotlarini oladi
    const rawProducts = await getStoreProducts(profile.organization_id, profile.store_id);

    // Context uchun formatlashtirish
    const initialProducts = rawProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || 'Boshqa',
        price: p.price,
        image: p.image_url || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', // default rasm
        label: p.label,
        quantity: p.inventory?.[0]?.stock || 0,
        sizes: p.sizes,
        colors: p.colors
    }));

    return (
        <StoreLayoutClient initialProducts={initialProducts} orgId={profile.organization_id} storeId={profile.store_id}>
            {children}
        </StoreLayoutClient>
    );
}
