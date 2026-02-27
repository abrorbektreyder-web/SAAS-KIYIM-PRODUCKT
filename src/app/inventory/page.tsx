import { products, formatPrice } from '@/lib/data';
import { AlertTriangle, Package } from 'lucide-react';

export default function InventoryPage() {
    const lowStock = products.filter(p => p.stock < 20);
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Ombor</h1>
                <p className="text-sm text-neutral-500">Mahsulotlar qoldig'ini kuzatish</p>
            </div>

            {/* Ombor KPI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-5 w-5 text-neutral-400" />
                        <span className="text-sm text-neutral-500">Umumiy qoldiq</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalStock} dona</p>
                </div>
                <div className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-5 w-5 text-neutral-400" />
                        <span className="text-sm text-neutral-500">Ombor qiymati</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatPrice(totalValue)} so'm</p>
                </div>
                <div className="card-hover rounded-xl border border-amber-900/30 bg-amber-900/10 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <span className="text-sm text-amber-500">Kam qoldiq</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-400">{lowStock.length} ta mahsulot</p>
                </div>
            </div>

            {/* Kam qoldiq ogohlantirish */}
            {lowStock.length > 0 && (
                <div className="rounded-xl border border-amber-800/30 bg-amber-900/10 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-medium text-amber-400">Kam qoldiq mahsulotlar</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {lowStock.map(p => (
                            <span key={p.id} className="rounded-lg border border-amber-800/30 bg-amber-900/20 px-3 py-1 text-xs text-amber-300">
                                {p.name} — {p.stock} dona
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Barcha mahsulotlar omborida */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Mahsulot</th>
                                <th className="px-5 py-3.5 font-medium">Turkum</th>
                                <th className="px-5 py-3.5 font-medium">Narx</th>
                                <th className="px-5 py-3.5 font-medium">Qoldiq</th>
                                <th className="px-5 py-3.5 font-medium">Holat</th>
                                <th className="px-5 py-3.5 font-medium">Qoldiq qiymati</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {products.map((p) => {
                                const stockLevel = p.stock < 10 ? 'xavfli' : p.stock < 20 ? 'kam' : 'yaxshi';
                                const levelStyle = stockLevel === 'xavfli' ? 'text-red-400' : stockLevel === 'kam' ? 'text-amber-400' : 'text-green-400';
                                const barWidth = Math.min((p.stock / 50) * 100, 100);
                                return (
                                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                                        <td className="px-5 py-4 font-medium text-white">{p.name}</td>
                                        <td className="px-5 py-4 text-neutral-400">{p.category}</td>
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-300">{formatPrice(p.price)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold w-10 ${levelStyle}`}>{p.stock}</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-neutral-800 max-w-[80px]">
                                                    <div className={`h-full rounded-full ${stockLevel === 'xavfli' ? 'bg-red-500' : stockLevel === 'kam' ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${barWidth}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-medium ${levelStyle}`}>{stockLevel === 'xavfli' ? '⚠ Kamayib ketdi' : stockLevel === 'kam' ? '⚡ Oz qoldi' : '✓ Yaxshi'}</span>
                                        </td>
                                        <td className="px-5 py-4 text-neutral-300 font-mono text-xs">{formatPrice(p.stock * p.price)}</td>
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
