'use client';

import { useState, useEffect } from 'react';
import {
    Settings, CreditCard, Shield, Bell, Save,
    Database, Activity, Key, Globe, Mail, MessageSquare, Trash2, X,
    RefreshCcw, Check, AlertCircle, Loader2
} from 'lucide-react';

type PackageItem = {
    tag: string;
    price: string;
    stores: number | 'Cheksiz';
    cashiers: number | 'Cheksiz';
    isActive: boolean;
};

export default function SuperAdminSettings() {
    const [activeTab, setActiveTab] = useState('tizim');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Form states
    const [systemSettings, setSystemSettings] = useState({
        platform_name: 'HOYR',
        base_url: 'https://hoyr.uz',
        support_email: 'support@hoyr.uz',
        seo_description: 'HOYR B2B Platformasi - Butiklar va kiyim do\'konlarini boshqarish uchun eng qulay SAAS yechimi.'
    });

    const [packages, setPackages] = useState<PackageItem[]>([]);

    // Modal state
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [packageForm, setPackageForm] = useState<PackageItem>({
        tag: '', price: '', stores: 1, cashiers: 2, isActive: true
    });

    // Load settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/super-admin/settings');
                const data = await res.json();
                
                if (data.platform_name) {
                    setSystemSettings({
                        platform_name: data.platform_name || 'HOYR',
                        base_url: data.base_url || 'https://hoyr.uz',
                        support_email: data.support_email || 'support@hoyr.uz',
                        seo_description: data.seo_description || ''
                    });
                }
                
                if (data.subscription_packages) {
                    setPackages(JSON.parse(data.subscription_packages));
                } else {
                    setPackages([
                        { tag: 'STARTER', price: '150 000', stores: 1, cashiers: 2, isActive: true },
                        { tag: 'BUSINESS', price: '300 000', stores: 5, cashiers: 10, isActive: true },
                        { tag: 'PREMIUM', price: '500 000', stores: 'Cheksiz', cashiers: 'Cheksiz', isActive: true },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const body = {
                ...systemSettings,
                subscription_packages: JSON.stringify(packages)
            };

            const res = await fetch('/api/super-admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Saqlashda xatolik yuz berdi');
            
            setStatus({ type: 'success', msg: 'Barcha o\'zgarishlar muvaffaqiyatli saqlandi!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error: any) {
            setStatus({ type: 'error', msg: error.message });
        } finally {
            setSaving(false);
        }
    };

    const openPackageModal = (index?: number) => {
        if (typeof index === 'number') {
            setEditingIndex(index);
            setPackageForm(packages[index]);
        } else {
            setEditingIndex(null);
            setPackageForm({ tag: '', price: '', stores: 1, cashiers: 2, isActive: true });
        }
        setIsPackageModalOpen(true);
    };

    const closePackageModal = () => {
        setIsPackageModalOpen(false);
        setEditingIndex(null);
    };

    const savePackage = () => {
        if (!packageForm.tag || !packageForm.price) return;

        const newPackages = [...packages];
        if (editingIndex !== null) {
            newPackages[editingIndex] = packageForm;
        } else {
            newPackages.push(packageForm);
        }

        setPackages(newPackages);
        closePackageModal();
    };

    const deletePackage = (index: number) => {
        if (confirm("Ushbu tarifni o'chirmoqchimisiz?")) {
            const newPackages = packages.filter((_, i) => i !== index);
            setPackages(newPackages);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-neutral-400 animate-pulse">Sozlamalar yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700 relative pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800/50 backdrop-blur-xl">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        System Configuration
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Platforma Sozlamalari</h1>
                    <p className="text-neutral-400 max-w-md">Loyiha xavfsizligi, tariflar va global parametrlarni nazorat qilish markazi.</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {status && (
                        <div className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl animate-in slide-in-from-top-2 duration-300 ${
                            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                            {status.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.msg}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative flex items-center gap-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden"
                    >
                        {saving ? (
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        <span>{saving ? 'Saqlanmoqda...' : 'O\'zgarishlarni Tasdiqlash'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                <div className="space-y-2 sticky top-8 h-fit">
                    {[
                        { id: 'tizim', label: 'Asosiy Axborotlar', icon: Globe },
                        { id: 'tariflar', label: 'Tariflar & Narxlar', icon: CreditCard },
                        { id: 'xavfsizlik', label: 'Xavfsizlik & Zaxira', icon: Shield },
                        { id: 'xabarlar', label: 'Xabarnomalar & Bot', icon: Bell },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === tab.id 
                                ? 'bg-white text-black shadow-xl shadow-white/5' 
                                : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-red-600' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-neutral-900/20 border border-neutral-800/40 rounded-[32px] p-8 backdrop-blur-sm min-h-[500px]">
                    {activeTab === 'tizim' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Platforma Identiteti</h3>
                                <p className="text-sm text-neutral-500">Loyiha nomi va aloqa ma'lumotlari.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Platforma Nomi</label>
                                    <input 
                                        type="text" 
                                        value={systemSettings.platform_name}
                                        onChange={e => setSystemSettings({...systemSettings, platform_name: e.target.value})}
                                        className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all hover:bg-neutral-800/60" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Asosiy Domen</label>
                                    <input 
                                        type="text" 
                                        value={systemSettings.base_url}
                                        onChange={e => setSystemSettings({...systemSettings, base_url: e.target.value})}
                                        className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all hover:bg-neutral-800/60" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Qo'llab-quvvatlash Emaili</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-red-400 transition-colors" />
                                    <input 
                                        type="email" 
                                        value={systemSettings.support_email}
                                        onChange={e => setSystemSettings({...systemSettings, support_email: e.target.value})}
                                        className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-2xl pl-13 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all hover:bg-neutral-800/60" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Loyiha Tavsifi (SEO)</label>
                                <textarea 
                                    rows={4} 
                                    value={systemSettings.seo_description}
                                    onChange={e => setSystemSettings({...systemSettings, seo_description: e.target.value})}
                                    className="w-full bg-neutral-800/40 border border-neutral-700/50 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all hover:bg-neutral-800/60 resize-none tabular-nums" 
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'tariflar' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white">Obuna Paketlari</h3>
                                    <p className="text-sm text-neutral-500">Mijozlaringiz uchun SAAS rejalari.</p>
                                </div>
                                <button
                                    onClick={() => openPackageModal()}
                                    className="px-6 py-3 rounded-xl bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all font-bold text-xs"
                                >
                                    + Yangi Paket
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {packages.map((pkg, idx) => (
                                    <div key={idx} className="group relative bg-neutral-800/30 border border-neutral-700/40 rounded-3xl p-6 hover:border-red-500/30 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black text-neutral-400 group-hover:text-red-400 transition-colors uppercase tracking-widest border border-white/5">
                                                {pkg.tag}
                                            </span>
                                            <div className="flex gap-2">
                                                <button onClick={() => openPackageModal(idx)} className="p-2 bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition-colors border border-neutral-700/50">
                                                    <Settings className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => deletePackage(idx)} className="p-2 bg-neutral-900 rounded-lg text-neutral-500 hover:text-red-400 transition-colors border border-neutral-700/50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <div className="text-3xl font-black text-white">{pkg.price}</div>
                                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">O'zbek so'mi / oy</div>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-neutral-700/30">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-neutral-500 font-medium">Filiallar:</span>
                                                <span className="text-white font-bold">{pkg.stores}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-neutral-500 font-medium">Kassirlar:</span>
                                                <span className="text-white font-bold">{pkg.cashiers}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-neutral-500 font-medium">Status:</span>
                                                <span className={`font-bold ${pkg.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {pkg.isActive ? 'Faol' : 'Nofaol'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'xavfsizlik' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Tizim Xavfsizligi</h3>
                                <p className="text-sm text-neutral-500">Muhim himoya va zaxiralash parametrlari.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-neutral-800/30 border border-neutral-700/40 rounded-[28px]">
                                    <div className="space-y-1">
                                        <div className="font-bold text-white flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-emerald-400" />
                                            Ikki Bosqichli Himoya (2FA)
                                        </div>
                                        <p className="text-xs text-neutral-500">Super Admin kirishi uchun SMS/Email tasdiqlash.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-14 h-7 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-neutral-800/30 border border-neutral-700/40 rounded-[28px]">
                                    <div className="space-y-1">
                                        <div className="font-bold text-white flex items-center gap-2">
                                            <Database className="w-4 h-4 text-blue-400" />
                                            Avtomatik Zaxiralash
                                        </div>
                                        <p className="text-xs text-neutral-500">Ma'lumotlar bazasini kunlik zaxiralash.</p>
                                    </div>
                                    <select className="bg-neutral-900 border border-neutral-700 text-xs text-white px-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors cursor-pointer font-bold">
                                        <option>Har kuni soat 23:59 da</option>
                                        <option>Har 12 soatda</option>
                                        <option>Haftada bir marta</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'xabarlar' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Bildirishnomalar</h3>
                                <p className="text-sm text-neutral-500">SMTP va Telegram Bot integratsiyasi.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-neutral-800/30 border border-neutral-700/40 rounded-[32px] space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-500/10 rounded-2xl">
                                            <Mail className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div className="font-black text-white uppercase tracking-wider text-sm">SMTP Server</div>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Host (smtp.gmail.com)" defaultValue="smtp.gmail.com" className="w-full bg-neutral-900 border border-neutral-700/50 rounded-xl px-4 py-3 text-xs text-white focus:border-red-500/50 transition-all outline-none" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Port" defaultValue="587" className="w-full bg-neutral-900 border border-neutral-700/50 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                                            <input type="password" placeholder="Parol" className="w-full bg-neutral-900 border border-neutral-700/50 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-neutral-800/30 border border-neutral-700/40 rounded-[32px] space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                                            <MessageSquare className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="font-black text-white uppercase tracking-wider text-sm">Telegram Bot</div>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Bot Token" className="w-full bg-neutral-900 border border-neutral-700/50 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500/50 transition-all outline-none" />
                                        <input type="text" placeholder="Chat ID" className="w-full bg-neutral-900 border border-neutral-700/50 rounded-xl px-4 py-3 text-xs text-white outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

             {isPackageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closePackageModal}></div>
                    <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden relative animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-8 border-b border-neutral-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingIndex !== null ? 'Tarifni Tahrirlash' : 'Yangi Tarif Qo\'shish'}
                            </h2>
                            <button onClick={closePackageModal} className="text-neutral-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Paket Nomi</label>
                                <input
                                    type="text"
                                    value={packageForm.tag}
                                    onChange={e => setPackageForm({ ...packageForm, tag: e.target.value.toUpperCase() })}
                                    placeholder="PREMIUM"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Narxi (So'm)</label>
                                <input
                                    type="text"
                                    value={packageForm.price}
                                    onChange={e => setPackageForm({ ...packageForm, price: e.target.value })}
                                    placeholder="500 000"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Filiallar</label>
                                    <input
                                        type="text"
                                        value={packageForm.stores}
                                        onChange={e => setPackageForm({ ...packageForm, stores: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 1 })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Kassirlar</label>
                                    <input
                                        type="text"
                                        value={packageForm.cashiers}
                                        onChange={e => setPackageForm({ ...packageForm, cashiers: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 2 })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-800/30 flex justify-end gap-3">
                            <button onClick={closePackageModal} className="px-6 py-3 text-sm font-bold text-neutral-400 hover:text-white transition-colors">Bekor qilish</button>
                            <button onClick={savePackage} className="px-8 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:bg-neutral-200 transition-all">Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
