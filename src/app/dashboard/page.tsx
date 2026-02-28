import { getStores, getOrders, getProducts, getOrgProfile, formatPrice, formatDate } from '@/lib/data';
import { TrendingUp, ShoppingCart, Package, Store, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const statusColor: Record<string, string> = {
    new: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    preparing: 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
};

const statusLabel: Record<string, string> = {
    new: 'Yangi', preparing: 'Tayyorlanmoqda', delivered: 'Topshirildi', cancelled: 'Bekor'
};

export default async function DashboardPage() {
    const profile = await getOrgProfile();

    if (!profile || !profile.organization_id) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 max-w-md">
                    <p className="text-neutral-400 text-sm">Tashkilotga biriktirilmagan admin.</p>
                    <p className="text-neutral-500 text-xs mt-2">Iltimos Super Admin bilan bog'laning.</p>
                </div>
            </div>
        );
    }

    const orgId = profile.organization_id;
    const [stores, orders, products] = await Promise.all([
        getStores(orgId),
        getOrders(orgId),
        getProducts(orgId)
    ]);

    const totalRevenue = orders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((s: number, x: any) => s + Number(x.total || 0), 0);

    const kpis = [
        { label: 'Jami daromad', value: formatPrice(totalRevenue) + ' so\'m', icon: TrendingUp, change: '+12.4%', up: true },
        { label: 'Jami buyurtmalar', value: orders.length.toLocaleString(), icon: ShoppingCart, change: '+8.1%', up: true },
        { label: 'Mahsulotlar', value: products.length.toLocaleString(), icon: Package, change: '+5.3%', up: true },
        { label: 'Filiallar', value: stores.length.toString(), icon: Store, change: '0%', up: false },
    ];

    const latestOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Bosh panel</h1>
                <p className="text-sm text-neutral-500">Tashkilotingiz bo'yicha umumiy ma'lumot</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                            <div className="flex items-start justify-between">
                                <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-2">
                                    <Icon className="h-5 w-5 text-neutral-400" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                    {kpi.up && <ArrowUpRight className="h-3 w-3" />}{kpi.change}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                                <p className="mt-1 text-sm text-neutral-500">{kpi.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Oylik sotuv</h2>
                    <div className="flex items-center justify-center h-40 bg-neutral-800/20 rounded-lg">
                        <p className="text-sm text-neutral-500">Analitika sahifasida to'liq grafik mavjud →</p>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Filiallar</h2>
                    <div className="space-y-3">
                        {stores.length === 0 ? (
                            <p className="text-xs text-neutral-500 mt-4 border border-dashed border-neutral-800 p-4 text-center rounded-lg">Hali filiallar yo'q.</p>
                        ) : stores.map((store: any) => (
                            <div key={store.id} className="flex items-center gap-3">
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${store.is_active ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{store.name}</p>
                                    <p className="text-xs text-neutral-500">{store.address || store.city || 'Manzil belgilanmagan'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Oxirgi buyurtmalar</h2>
                    <Link href="/dashboard/orders" className="text-xs text-neutral-400 hover:text-white transition-colors">
                        Hammasini ko'rish →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                <th className="pb-3 font-medium">Raqami</th>
                                <th className="pb-3 font-medium">To'lov</th>
                                <th className="pb-3 font-medium">Summa</th>
                                <th className="pb-3 font-medium">Sana</th>
                                <th className="pb-3 font-medium">Holat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {latestOrders.length === 0 ? (
                                <tr><td colSpan={5} className="py-4 text-center text-xs text-neutral-500">Buyurtmalar hali mavjud emas.</td></tr>
                            ) : latestOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="py-3 font-mono text-xs text-neutral-400">{order.order_number}</td>
                                    <td className="py-3 text-neutral-300 capitalize">{order.payment_method}</td>
                                    <td className="py-3 font-medium text-white">{formatPrice(order.total)} so'm</td>
                                    <td className="py-3 text-neutral-400">{formatDate(order.created_at)}</td>
                                    <td className="py-3">
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
        </div>
    );
}
