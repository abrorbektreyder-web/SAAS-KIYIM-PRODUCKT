import { getOrders, getOrgProfile, formatPrice, formatDate } from '@/lib/data';

const statusColor: Record<string, string> = {
    new: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    preparing: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
};

const statusLabel: Record<string, string> = {
    new: 'Yangi', preparing: 'Tayyorlanmoqda', delivered: 'Topshirildi', cancelled: 'Bekor qilingan'
};

export default async function OrdersPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const orders = await getOrders(profile.organization_id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Buyurtmalar</h1>
                <p className="text-sm text-neutral-500">Barcha buyurtmalarni kuzatish va boshqarish</p>
            </div>

            {orders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Buyurtmalar hali mavjud emas.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3.5 font-medium">Buyurtma №</th>
                                    <th className="px-5 py-3.5 font-medium">Mijoz</th>
                                    <th className="px-5 py-3.5 font-medium">To'lov</th>
                                    <th className="px-5 py-3.5 font-medium">Summa</th>
                                    <th className="px-5 py-3.5 font-medium">Sana</th>
                                    <th className="px-5 py-3.5 font-medium">Holat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-400">{order.order_number}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-white">{order.customers?.full_name || '—'}</p>
                                            <p className="text-xs text-neutral-500">{order.customers?.phone || ''}</p>
                                        </td>
                                        <td className="px-5 py-4 text-neutral-400 capitalize">{order.payment_method}</td>
                                        <td className="px-5 py-4 font-medium text-white">{formatPrice(order.total)} so'm</td>
                                        <td className="px-5 py-4 text-neutral-500 text-xs">{formatDate(order.created_at)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[order.status] || ''}`}>
                                                {statusLabel[order.status] || order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
