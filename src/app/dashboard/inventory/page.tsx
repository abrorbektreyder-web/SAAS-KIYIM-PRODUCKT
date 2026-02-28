import { getProducts, getOrgProfile, formatPrice } from '@/lib/data';
import { AlertTriangle, Package } from 'lucide-react';

export default async function InventoryPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const products = await getProducts(profile.organization_id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Ombor</h1>
                <p className="text-sm text-neutral-500">Mahsulotlar qoldig'ini kuzatish</p>
            </div>

            {products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Mahsulotlar hali mavjud emas.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3.5 font-medium">Mahsulot</th>
                                    <th className="px-5 py-3.5 font-medium">Turkum</th>
                                    <th className="px-5 py-3.5 font-medium">Narx</th>
                                    <th className="px-5 py-3.5 font-medium">Holat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {products.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                                        <td className="px-5 py-4 font-medium text-white">{p.name}</td>
                                        <td className="px-5 py-4 text-neutral-400">{p.categories?.name || '—'}</td>
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-300">{formatPrice(p.price)} so'm</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active
                                                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                                }`}>
                                                {p.is_active ? 'Faol' : 'Nofaol'}
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
