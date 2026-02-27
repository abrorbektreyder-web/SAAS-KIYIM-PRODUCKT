import { orders, formatPrice } from '@/lib/data';
import { Search } from 'lucide-react';

const statusColor: Record<string, string> = {
    yangi: 'badge-warning',
    tayyorlanmoqda: 'badge-neutral',
    yetkazildi: 'badge-success',
    'bekor qilindi': 'badge-danger',
};

export default function OrdersPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Buyurtmalar</h1>
                <p className="text-sm text-neutral-500">Barcha buyurtmalarni kuzatish va boshqarish</p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input type="text" placeholder="Mijoz yoki ID qidirish..." className="rounded-lg border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none" />
                </div>
                {['Barchasi', 'yangi', 'tayyorlanmoqda', 'yetkazildi', 'bekor qilindi'].map((s) => (
                    <button key={s} className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${s === 'Barchasi' ? 'bg-white text-black' : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Jadval */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Buyurtma ID</th>
                                <th className="px-5 py-3.5 font-medium">Mijoz</th>
                                <th className="px-5 py-3.5 font-medium">Telefon</th>
                                <th className="px-5 py-3.5 font-medium">Mahsulotlar</th>
                                <th className="px-5 py-3.5 font-medium">Summa</th>
                                <th className="px-5 py-3.5 font-medium">Sana</th>
                                <th className="px-5 py-3.5 font-medium">Holat</th>
                                <th className="px-5 py-3.5 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">{order.id}</td>
                                    <td className="px-5 py-4 font-medium text-white">{order.customerName}</td>
                                    <td className="px-5 py-4 text-neutral-400">{order.customerPhone}</td>
                                    <td className="px-5 py-4 text-neutral-400 text-xs">{order.products.join(', ')}</td>
                                    <td className="px-5 py-4 font-medium text-white">{formatPrice(order.total)} so'm</td>
                                    <td className="px-5 py-4 text-neutral-500 text-xs">{order.date}</td>
                                    <td className="px-5 py-4">
                                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColor[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <select className="text-xs bg-transparent border border-neutral-700 rounded px-2 py-1 text-neutral-400 hover:border-neutral-500 focus:outline-none">
                                            <option>Holat o'zgartir</option>
                                            <option>yangi</option>
                                            <option>tayyorlanmoqda</option>
                                            <option>yetkazildi</option>
                                            <option>bekor qilindi</option>
                                        </select>
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
