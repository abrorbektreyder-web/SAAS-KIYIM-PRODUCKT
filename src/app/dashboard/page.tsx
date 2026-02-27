import { stores, orders, products, salesData, formatPrice } from '@/lib/data';
import { TrendingUp, ShoppingCart, Package, Users, Store, ArrowUpRight } from 'lucide-react';

const totalRevenue = stores.reduce((s, x) => s + x.totalRevenue, 0);
const totalOrders = stores.reduce((s, x) => s + x.totalOrders, 0);
const totalProducts = stores.reduce((s, x) => s + x.totalProducts, 0);

const kpis = [
    { label: 'Jami daromad', value: formatPrice(totalRevenue) + ' so\'m', icon: TrendingUp, change: '+12.4%', up: true },
    { label: 'Jami buyurtmalar', value: totalOrders.toLocaleString(), icon: ShoppingCart, change: '+8.1%', up: true },
    { label: 'Mahsulotlar', value: totalProducts.toLocaleString(), icon: Package, change: '+5.3%', up: true },
    { label: 'Faol do\'konlar', value: stores.filter(s => s.status === 'faol').length.toString(), icon: Store, change: '0%', up: false },
];

const statusColor: Record<string, string> = {
    yangi: 'badge-warning',
    tayyorlanmoqda: 'badge-neutral',
    yetkazildi: 'badge-success',
    'bekor qilindi': 'badge-danger',
};

export default function DashboardPage() {
    const latestOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Sarlavha */}
            <div>
                <h1 className="text-2xl font-bold text-white">Bosh panel</h1>
                <p className="text-sm text-neutral-500">Barcha do'konlar bo'yicha umumiy ma'lumot</p>
            </div>

            {/* KPI kartalar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                            <div className="flex items-start justify-between">
                                <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-2">
                                    <Icon className="h-5 w-5 text-neutral-400" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-green-400' : 'text-neutral-500'}`}>
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
                {/* Sotuv grafigi (sodda bar) */}
                <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Oylik sotuv</h2>
                    <div className="flex items-end gap-2 h-40">
                        {salesData.map((d) => {
                            const maxSale = Math.max(...salesData.map(x => x.sotuv));
                            const height = (d.sotuv / maxSale) * 100;
                            return (
                                <div key={d.oy} className="flex flex-1 flex-col items-center gap-1">
                                    <div className="w-full group relative flex justify-center">
                                        <div
                                            className="w-full cursor-pointer rounded-t-sm bg-neutral-700 group-hover:bg-white transition-colors"
                                            style={{ height: `${height * 1.4}px` }}
                                        />
                                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-white text-black text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {formatPrice(d.sotuv)} so'm
                                        </div>
                                    </div>
                                    <span className="text-xs text-neutral-600">{d.oy}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Do'konlar holati */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Do'konlar</h2>
                    <div className="space-y-3">
                        {stores.map((store) => (
                            <div key={store.id} className="flex items-center gap-3">
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${store.status === 'faol' ? 'bg-green-400' : 'bg-neutral-600'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{store.name}</p>
                                    <p className="text-xs text-neutral-500">{store.totalOrders} buyurtma</p>
                                </div>
                                <span className="text-xs text-neutral-400 font-mono">{formatPrice(store.totalRevenue)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Oxirgi buyurtmalar */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Oxirgi buyurtmalar</h2>
                    <a href="/orders" className="text-xs text-neutral-400 hover:text-white transition-colors">
                        Hammasini ko'rish →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                <th className="pb-3 font-medium">ID</th>
                                <th className="pb-3 font-medium">Mijoz</th>
                                <th className="pb-3 font-medium">Telefon</th>
                                <th className="pb-3 font-medium">Summa</th>
                                <th className="pb-3 font-medium">Holat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {latestOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="py-3 font-mono text-xs text-neutral-400">{order.id}</td>
                                    <td className="py-3 text-white">{order.customerName}</td>
                                    <td className="py-3 text-neutral-400">{order.customerPhone}</td>
                                    <td className="py-3 font-medium text-white">{formatPrice(order.total)} so'm</td>
                                    <td className="py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColor[order.status]}`}>
                                            {order.status}
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
