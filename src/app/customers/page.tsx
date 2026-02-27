import { customers, formatPrice } from '@/lib/data';
import { Search, Plus } from 'lucide-react';

export default function CustomersPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mijozlar</h1>
                    <p className="text-sm text-neutral-500">Doimiy xaridorlar ro'yxati</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Mijoz qo'shish
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input type="text" placeholder="Ism yoki telefon qidirish..." className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none" />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Mijoz</th>
                                <th className="px-5 py-3.5 font-medium">Telefon</th>
                                <th className="px-5 py-3.5 font-medium">Buyurtmalar</th>
                                <th className="px-5 py-3.5 font-medium">Jami xarid</th>
                                <th className="px-5 py-3.5 font-medium">Oxirgi buyurtma</th>
                                <th className="px-5 py-3.5 font-medium">Daraja</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {customers.map((c) => {
                                const tier = c.totalSpent > 3000000 ? { label: 'VIP', cls: 'badge-success' }
                                    : c.totalSpent > 1500000 ? { label: 'Doimiy', cls: 'badge-warning' }
                                        : { label: 'Yangi', cls: 'badge-neutral' };
                                return (
                                    <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-white">
                                                    {c.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium text-white">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-neutral-400">{c.phone}</td>
                                        <td className="px-5 py-4 text-white font-medium">{c.totalOrders}</td>
                                        <td className="px-5 py-4 text-white font-medium">{formatPrice(c.totalSpent)} so'm</td>
                                        <td className="px-5 py-4 text-neutral-500 text-xs">{c.lastOrder}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${tier.cls}`}>{tier.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
