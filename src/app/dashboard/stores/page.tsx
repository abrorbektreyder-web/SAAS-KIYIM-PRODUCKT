import { getStores, getOrgProfile, formatPrice } from '@/lib/data';
import { Plus, MapPin } from 'lucide-react';

export default async function StoresPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const stores = await getStores(profile.organization_id);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Do'konlar (Filiallar)</h1>
                    <p className="text-sm text-neutral-500">Barcha filiallarni boshqarish</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Yangi filial
                </button>
            </div>

            {stores.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-12 text-center">
                    <p className="text-neutral-500 text-sm">Hali filiallar qo'shilmagan.</p>
                    <p className="text-neutral-600 text-xs mt-1">Yangi filial tugmasini bosing.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                    {stores.map((store: any) => (
                        <div key={store.id} className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-white">{store.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3 text-neutral-500" />
                                        <span className="text-xs text-neutral-500">{store.address || store.city || 'Manzil belgilanmagan'}</span>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${store.is_active
                                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                    : 'bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20'
                                    }`}>
                                    {store.is_active ? 'Faol' : 'Nofaol'}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-800">
                                <span className="text-xs text-neutral-500">{store.phone || 'Tel. belgilanmagan'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
