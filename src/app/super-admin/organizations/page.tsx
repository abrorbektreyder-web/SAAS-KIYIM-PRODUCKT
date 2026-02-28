'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, ShieldBan, ShieldCheck, Trash2 } from 'lucide-react';

type Organization = {
    id: string;
    name: string;
    slug: string;
    plan: string;
    subscription_status: string;
    email: string;
    subscription_ends_at: string;
    max_stores: number;
    max_cashiers: number;
};

export default function SuperAdminOrganizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [form, setForm] = useState({
        name: '', slug: '', email: '', plan: 'starter', max_stores: 1, max_cashiers: 2
    });

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/organizations');
            const data = await res.json();
            if (data.organizations) {
                setOrganizations(data.organizations);
            }
        } catch (e) {
            console.error("Failed to load", e);
        }
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                fetchOrgs();
            } else {
                const err = await res.json();
                alert('Xatolik yuz berdi yaratishda: ' + (err.error || 'Noma\'lum xato'));
            }
        } catch (e: any) {
            alert('Server xatosi: ' + e.message);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, subscription_status: newStatus })
            });
            if (res.ok) {
                fetchOrgs();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteOrg = async (id: string) => {
        if (!confirm('Rostdan ham o\'chirib tashlaysizmi? Ushbu amalni qaytarib bo\'lmaydi!')) return;
        try {
            const res = await fetch(`/api/admin/organizations?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchOrgs();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Tashkilotlar</h1>
                    <p className="text-sm text-neutral-400 mt-1">Barcha do'konlar va ularning egalari haqida ma'lumot</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Do'kon qo'shish
                </button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-neutral-800/50 text-xs uppercase text-neutral-500 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Do'kon nomi</th>
                                <th className="px-6 py-4 font-medium">Egasi (Email)</th>
                                <th className="px-6 py-4 font-medium">Tarif</th>
                                <th className="px-6 py-4 font-medium">Holat</th>
                                <th className="px-6 py-4 font-medium text-center">Filial/Kassir L.</th>
                                <th className="px-6 py-4 font-medium text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Yuklanmoqda...</td>
                                </tr>
                            ) : organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Tashkilotlar mavjud emas.</td>
                                </tr>
                            ) : organizations.map((org) => (
                                <tr key={org.id} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{org.name} <br /><span className="text-xs text-neutral-500">/{org.slug}</span></td>
                                    <td className="px-6 py-4">{org.email}</td>
                                    <td className="px-6 py-4 uppercase text-xs">{org.plan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${org.subscription_status === 'blocked' ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                                            : org.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                                            }`}>
                                            {org.subscription_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">{org.max_stores} / {org.max_cashiers}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => toggleStatus(org.id, org.subscription_status)} className="text-neutral-400 hover:text-white transition-colors p-1.5 bg-neutral-800 rounded">
                                            {org.subscription_status === 'blocked' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldBan className="w-4 h-4 text-red-500" />}
                                        </button>
                                        <button onClick={() => deleteOrg(org.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-1.5 bg-neutral-800 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-white mb-4">Yangi tashkilot qo'shish</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Tashkilot nomi</label>
                                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2" placeholder="Masalan: Baraka Do'konlari" />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">URL Slug (kuchsiz harflar, bo'sh joysiz)</label>
                                <input required type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2" placeholder="baraka-dokon" />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Egasi Email manzili</label>
                                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2" placeholder="owner@gmail.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1 block">Tarif</label>
                                    <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2">
                                        <option value="starter">Starter</option>
                                        <option value="business">Business</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-neutral-400 mb-1 block">Max Filial</label>
                                        <input required type="number" min="1" value={form.max_stores} onChange={e => setForm({ ...form, max_stores: parseInt(e.target.value) })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-400 mb-1 block">Max Kassir</label>
                                        <input required type="number" min="1" value={form.max_cashiers} onChange={e => setForm({ ...form, max_cashiers: parseInt(e.target.value) })} className="w-full rounded-lg bg-neutral-800 border-neutral-700 text-sm text-white px-3 py-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
