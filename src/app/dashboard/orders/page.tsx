import { getOrders, getOrgProfile } from '@/lib/data';
import OrdersClient from './orders-client';

export default async function OrdersPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const orders = await getOrders(profile.organization_id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Buyurtmalar</h1>
                    <p className="text-sm text-neutral-500">Barcha buyurtmalarni kuzatish va bajarilgan ishlarni boshqarish</p>
                </div>
            </div>

            <OrdersClient 
                orgId={profile.organization_id} 
                orgName={profile.organizations?.name || 'HOYR Do\'koni'} 
                initialOrders={orders}
            />
        </div>
    );
}
