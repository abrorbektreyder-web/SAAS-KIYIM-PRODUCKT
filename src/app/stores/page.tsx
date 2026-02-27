'use client';

import { useState } from 'react';
import { stores as initialStores, formatPrice, type Store } from '@/lib/data';
import { Plus, MapPin, TrendingUp, ShoppingCart, Package } from 'lucide-react';
import Modal, { FormInput, FormSelect, FormButton } from '@/components/ui/modal';

export default function StoresPage() {
    const [storeList, setStoreList] = useState<Store[]>(initialStores);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', location: '', status: 'faol' as 'faol' | 'nofaol' });
    const [success, setSuccess] = useState('');

    const handleAdd = () => {
        if (!form.name || !form.location) return;
        const newStore: Store = {
            id: 's' + (storeList.length + 1),
            name: form.name,
            location: form.location,
            status: form.status,
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
        };
        setStoreList([...storeList, newStore]);
        setForm({ name: '', location: '', status: 'faol' });
        setModalOpen(false);
        setSuccess(`"${newStore.name}" do'koni qo'shildi!`);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Do'konlar</h1>
                    <p className="text-sm text-neutral-500">Barcha filiallarni boshqarish</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Yangi do'kon
                </button>
            </div>

            {success && (
                <div className="rounded-lg border border-green-800/40 bg-green-900/20 px-4 py-3 text-sm text-green-400 animate-fade-in">
                    ✅ {success}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                {storeList.map((store) => (
                    <div key={store.id} className="card-hover rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-white">{store.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-neutral-500" />
                                    <span className="text-xs text-neutral-500">{store.location}</span>
                                </div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${store.status === 'faol' ? 'badge-success' : 'badge-neutral'}`}>
                                {store.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                            <div>
                                <div className="flex items-center gap-1 text-neutral-500 mb-1">
                                    <TrendingUp className="h-3.5 w-3.5" /><span className="text-xs">Daromad</span>
                                </div>
                                <p className="text-sm font-bold text-white">{formatPrice(store.totalRevenue)} so'm</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-neutral-500 mb-1">
                                    <ShoppingCart className="h-3.5 w-3.5" /><span className="text-xs">Buyurtma</span>
                                </div>
                                <p className="text-sm font-bold text-white">{store.totalOrders}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-neutral-500 mb-1">
                                    <Package className="h-3.5 w-3.5" /><span className="text-xs">Mahsulot</span>
                                </div>
                                <p className="text-sm font-bold text-white">{store.totalProducts}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 rounded-lg border border-neutral-700 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors">Boshqarish</button>
                            <button className="flex-1 rounded-lg border border-neutral-700 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors">Hisobot</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Yangi do'kon modali */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yangi do'kon qo'shish">
                <div className="space-y-4">
                    <FormInput label="Do'kon nomi" placeholder="Masalan: HOYR Buxoro" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <FormInput label="Joylashuv" placeholder="Masalan: Buxoro, Markaziy" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <FormSelect label="Holat" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'faol' | 'nofaol' })}>
                        <option value="faol">Faol</option>
                        <option value="nofaol">Nofaol</option>
                    </FormSelect>
                    <FormButton onClick={handleAdd} disabled={!form.name || !form.location}>Qo'shish</FormButton>
                </div>
            </Modal>
        </div>
    );
}
