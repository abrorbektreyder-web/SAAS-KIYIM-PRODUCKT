'use client';

import { useState } from 'react';
import { products as initialProducts, formatPrice, type Product } from '@/lib/data';
import { Plus, Search } from 'lucide-react';
import Modal, { FormInput, FormSelect, FormButton } from '@/components/ui/modal';

export default function ProductsPage() {
    const [productList, setProductList] = useState<Product[]>(initialProducts);
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        name: '', category: 'Ko\'ylak', price: '', stock: '', sizes: '', colors: '',
    });

    const handleAdd = () => {
        if (!form.name || !form.price || !form.stock) return;
        const newProduct: Product = {
            id: 'p' + (productList.length + 1),
            storeId: 's1',
            name: form.name,
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            size: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
            color: form.colors.split(',').map(s => s.trim()).filter(Boolean),
            status: 'faol',
        };
        setProductList([...productList, newProduct]);
        setForm({ name: '', category: 'Ko\'ylak', price: '', stock: '', sizes: '', colors: '' });
        setModalOpen(false);
        setSuccess(`"${newProduct.name}" mahsuloti qo'shildi!`);
        setTimeout(() => setSuccess(''), 3000);
    };

    const filtered = productList.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = !catFilter || p.category === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
                    <p className="text-sm text-neutral-500">Do'kon assortimentini boshqarish</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    Mahsulot qo'shish
                </button>
            </div>

            {success && (
                <div className="rounded-lg border border-green-800/40 bg-green-900/20 px-4 py-3 text-sm text-green-400 animate-fade-in">
                    ✅ {success}
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input type="text" placeholder="Mahsulot qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none" />
                </div>
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none">
                    <option value="">Barcha turkumlar</option>
                    <option>Ko'ylak</option>
                    <option>Shim</option>
                    <option>Kurtka</option>
                    <option>Bolalar</option>
                    <option>Milliy</option>
                </select>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-neutral-900/80 text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Mahsulot nomi</th>
                                <th className="px-5 py-3.5 font-medium">Turkum</th>
                                <th className="px-5 py-3.5 font-medium">Narx</th>
                                <th className="px-5 py-3.5 font-medium">Qoldiq</th>
                                <th className="px-5 py-3.5 font-medium">O'lchamlar</th>
                                <th className="px-5 py-3.5 font-medium">Holat</th>
                                <th className="px-5 py-3.5 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="font-medium text-white">{product.name}</p>
                                            <p className="text-xs text-neutral-500 mt-0.5">{product.color.join(', ')}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-neutral-400">{product.category}</td>
                                    <td className="px-5 py-4 font-mono text-white">{formatPrice(product.price)} so'm</td>
                                    <td className="px-5 py-4">
                                        <span className={`${product.stock < 10 ? 'text-red-400' : product.stock < 20 ? 'text-yellow-400' : 'text-white'} font-medium`}>
                                            {product.stock} dona
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {product.size.slice(0, 3).map((s) => (
                                                <span key={s} className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400">{s}</span>
                                            ))}
                                            {product.size.length > 3 && <span className="text-xs text-neutral-600">+{product.size.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${product.status === 'faol' ? 'badge-success' : 'badge-neutral'}`}>{product.status}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="text-xs text-neutral-500 hover:text-white transition-colors">Tahrirlash</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mahsulot qo'shish modali */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yangi mahsulot qo'shish">
                <div className="space-y-4">
                    <FormInput label="Mahsulot nomi" placeholder="Masalan: Yozgi ko'ylak" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <FormSelect label="Turkum" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <option>Ko'ylak</option>
                        <option>Shim</option>
                        <option>Kurtka</option>
                        <option>Bolalar</option>
                        <option>Milliy</option>
                    </FormSelect>
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Narx (so'm)" type="number" placeholder="150000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        <FormInput label="Qoldiq (dona)" type="number" placeholder="50" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                    </div>
                    <FormInput label="O'lchamlar (vergul bilan)" placeholder="S, M, L, XL" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
                    <FormInput label="Ranglar (vergul bilan)" placeholder="Oq, Qora, Ko'k" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
                    <FormButton onClick={handleAdd} disabled={!form.name || !form.price || !form.stock}>Qo'shish</FormButton>
                </div>
            </Modal>
        </div>
    );
}
