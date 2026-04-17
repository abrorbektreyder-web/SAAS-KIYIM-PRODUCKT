'use client';

import { useState, useEffect } from 'react';
import {
    Settings, CreditCard, Shield, Bell, Save,
    Database, Activity, Key, Globe, Mail, MessageSquare, Trash2, X,
    RefreshCcw, Check, AlertCircle, Loader2, Zap, Layout, HardDrive, 
    Lock, Sparkles, Server, Cpu, Layers, Store
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
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-xl font-bold text-white tracking-tight">Xavfsiz ulanish o'rnatilmoqda</p>
                    <p className="text-sm text-neutral-500">Global sozlamalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-24">
            {/* Header Section with Glassmorphism */}
            <div className="relative overflow-hidden rounded-[32px] border border-neutral-800/50 bg-[#09090b] p-8 shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
                                Enterprise Console
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Tizim Faol
                            </div>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight">
                            Platforma <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Sozlamalari</span>
                        </h1>
                        <p className="text-sm text-neutral-400 max-w-xl font-medium leading-relaxed">
                            HOYR ekotizimining global parametrlari va tijorat tariflarini boshqarish markazi.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {status && (
                            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-right-4 duration-500 ${
                                status.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                                {status.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="text-[10px] font-bold tracking-tight">{status.msg}</span>
                            </div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="group relative flex items-center gap-3 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 px-7 py-3.5 rounded-xl text-xs font-black transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95 overflow-hidden"
                        >
                            {saving ? (
                                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                            )}
                            <span className="tracking-widest">{saving ? 'SAQLANMOQDA...' : 'TASDIQLASH'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout: Bento Style Sidebar & Content */}
            <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
                {/* Navigation Column */}
                <div className="space-y-3">
                    <div className="bg-[#09090b] border border-neutral-800/50 rounded-[28px] p-4 space-y-1 shadow-xl">
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-3 px-3">Kategoriyalar</p>
                        {[
                            { id: 'tizim', label: 'Identitet', icon: Globe, desc: 'Domen va SEO' },
                            { id: 'tariflar', label: 'Tariflar', icon: CreditCard, desc: 'SAAS rejalari' },
                            { id: 'xavfsizlik', label: 'Xavfsizlik', icon: Shield, desc: '2FA va Zaxira' },
                            { id: 'xabarlar', label: 'Bildirishnomalar', icon: Bell, desc: 'Bot va Email' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full group flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-neutral-800 text-white shadow-lg ring-1 ring-neutral-700/50' 
                                    : 'text-neutral-500 hover:bg-neutral-800/30 hover:text-neutral-300'
                                }`}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${
                                    activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-neutral-900 text-neutral-700 group-hover:text-neutral-500'
                                }`}>
                                    <tab.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-black tracking-tight leading-tight pt-0.5">{tab.label}</p>
                                    <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider">{tab.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* System Stats Card */}
                    <div className="bg-gradient-to-br from-red-600/5 to-transparent border border-neutral-800/50 rounded-[28px] p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <Activity className="w-4 h-4 text-red-500" />
                            <span className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Live Stats</span>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                                    <span>Server Load</span>
                                    <span>12%</span>
                                </div>
                                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500/50 w-[12%]" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                                    <span>DB Capacity</span>
                                    <span>4.2GB</span>
                                </div>
                                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500/50 w-[8%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-[#09090b] border border-neutral-800/50 rounded-[32px] p-8 shadow-2xl min-h-[500px] relative overflow-hidden">
                    <div className="relative z-10">
                        {activeTab === 'tizim' && (
                            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-red-500 mb-1">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Core Identity</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Platforma Identiteti</h3>
                                    <p className="text-xs text-neutral-500 font-medium">Loyiha nomi va SEO parametrlari.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 group">
                                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors">Platforma Nomi</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={systemSettings.platform_name}
                                                onChange={e => setSystemSettings({...systemSettings, platform_name: e.target.value})}
                                                className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-5 py-3 text-sm font-bold text-white focus:border-red-500/50 outline-none transition-all" 
                                            />
                                            <Zap className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-800" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-500 transition-colors">Asosiy Domen</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={systemSettings.base_url}
                                                onChange={e => setSystemSettings({...systemSettings, base_url: e.target.value})}
                                                className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-5 py-3 text-sm font-bold text-white focus:border-amber-500/50 outline-none transition-all" 
                                            />
                                            <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-800" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1">Qo'llab-quvvatlash Emaili</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-red-500 transition-colors" />
                                        <input 
                                            type="email" 
                                            value={systemSettings.support_email}
                                            onChange={e => setSystemSettings({...systemSettings, support_email: e.target.value})}
                                            className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-13 pr-5 py-3 text-sm font-bold text-white focus:border-red-500/50 outline-none transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em]">SEO Tavsifi</label>
                                        <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-widest">{systemSettings.seo_description.length} / 300</span>
                                    </div>
                                    <textarea 
                                        rows={4} 
                                        value={systemSettings.seo_description}
                                        onChange={e => setSystemSettings({...systemSettings, seo_description: e.target.value})}
                                        className="w-full bg-[#111111] border border-neutral-800 rounded-[20px] px-6 py-4 text-sm font-medium text-neutral-400 focus:border-red-500/50 outline-none transition-all resize-none" 
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'tariflar' && (
                            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-red-500 mb-1">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Pricing Plans</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">Obuna Paketlari</h3>
                                        <p className="text-xs text-neutral-500 font-medium">SAAS rejalarini boshqarish.</p>
                                    </div>
                                    <button
                                        onClick={() => openPackageModal()}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-black text-[11px] shadow-lg active:scale-95"
                                    >
                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                        YANGI PAKET
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {packages.map((pkg, idx) => (
                                        <div key={idx} className="group relative bg-[#111111] border border-neutral-800 rounded-[24px] p-6 hover:border-red-500/30 transition-all duration-300">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-[8px] font-black text-red-500 uppercase tracking-widest">
                                                            {pkg.tag}
                                                        </span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-black text-white">{pkg.price}</span>
                                                            <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">UZS</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button 
                                                            onClick={() => openPackageModal(idx)} 
                                                            className="p-2 bg-neutral-900 rounded-lg text-neutral-600 hover:text-white transition-all border border-neutral-800"
                                                        >
                                                            <Settings className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deletePackage(idx)} 
                                                            className="p-2 bg-neutral-900 rounded-lg text-neutral-600 hover:text-red-400 transition-all border border-neutral-800"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-4 border-t border-neutral-800/50">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Filiallar</span>
                                                        <span className="text-xs font-black text-white">{pkg.stores}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Kassirlar</span>
                                                        <span className="text-xs font-black text-white">{pkg.cashiers}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Status</span>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${pkg.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {pkg.isActive ? 'Faol' : 'Nofaol'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'xavfsizlik' && (
                            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-red-500 mb-2">
                                        <Shield className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Security Protocols</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">Xavfsizlik & Zaxira</h3>
                                    <p className="text-neutral-500 font-medium">Muhim himoya va ma'lumotlar butunligi parametrlari.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="group flex items-center justify-between p-8 bg-[#111111] border border-neutral-800 rounded-[32px] hover:border-red-500/20 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-emerald-500/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                                                <Lock className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-white tracking-tight">Ikki Bosqichli Himoya (2FA)</h4>
                                                <p className="text-sm text-neutral-500 font-medium">Super Admin kirishi uchun SMS va Email tasdiqlash talab etilsin.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-16 h-8 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-neutral-500 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white" />
                                        </label>
                                    </div>

                                    <div className="group flex items-center justify-between p-8 bg-[#111111] border border-neutral-800 rounded-[32px] hover:border-amber-500/20 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-amber-500/5 rounded-2xl group-hover:bg-amber-500/10 transition-colors">
                                                <Database className="w-8 h-8 text-amber-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-white tracking-tight">Avtomatik Zaxira (Backup)</h4>
                                                <p className="text-sm text-neutral-500 font-medium">Ma'lumotlar bazasini belgilangan vaqtda avtomatik bulutga nusxalash.</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <select className="appearance-none bg-[#1a1a1a] border border-neutral-800 text-sm font-black text-white px-8 py-4 pr-12 rounded-[20px] outline-none focus:border-amber-500 transition-all cursor-pointer shadow-xl">
                                                <option>Har kuni 23:59</option>
                                                <option>Har 12 soatda</option>
                                                <option>Har 6 soatda</option>
                                            </select>
                                            <RefreshCcw className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 flex items-start gap-6">
                                    <div className="p-3 bg-red-500/10 rounded-xl mt-1">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-red-500 tracking-tight">Xavf zonasi: Ma'lumotlarni o'chirish</h4>
                                        <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                                            Agar siz barcha tranzaksiya va loglarni tozalashni xohlasangiz, quyidagi tugmani bosing. Bu amalni ortga qaytarib bo'lmaydi va xavfsizlik uchun parolingizni kiritishingiz kerak bo'ladi.
                                        </p>
                                        <button className="mt-4 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            Barcha loglarni tozalash
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'xabarlar' && (
                            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-red-500 mb-2">
                                        <Bell className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Integrations</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">Bildirishnomalar & Integratsiya</h3>
                                    <p className="text-neutral-500 font-medium">Tashqi kanallar va avtomatlashtirilgan xabarlar tizimi.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* SMTP Server Card */}
                                    <div className="group bg-[#111111] border border-neutral-800 rounded-[40px] p-10 space-y-8 hover:border-red-500/20 transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                                <Mail className="w-8 h-8 text-red-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-white tracking-tight">SMTP SERVER</h4>
                                                <p className="text-xs text-neutral-600 font-black uppercase tracking-widest">Email Gateway</p>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Host Manzili</label>
                                                <input type="text" placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-red-500/50 outline-none transition-all" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Port</label>
                                                    <input type="text" placeholder="587" defaultValue="587" className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Xavfsizlik</label>
                                                    <select className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none appearance-none">
                                                        <option>STARTTLS</option>
                                                        <option>SSL/TLS</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Maxfiy Kalit (App Password)</label>
                                                <div className="relative">
                                                    <input type="password" placeholder="••••••••••••••••" className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-red-500/50 transition-all" />
                                                    <Key className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Telegram Bot Card */}
                                    <div className="group bg-[#111111] border border-neutral-800 rounded-[40px] p-10 space-y-8 hover:border-blue-500/20 transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                                <MessageSquare className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-white tracking-tight">TELEGRAM BOT</h4>
                                                <p className="text-xs text-neutral-600 font-black uppercase tracking-widest">Real-time alerts</p>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Bot Token (API Key)</label>
                                                <input type="text" placeholder="712345678:AAH..." className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Ma'mur Chat ID</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="-100123456789" className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all" />
                                                    <Activity className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <button className="w-full py-4 bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                                                    Ulanishni tekshirish
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Package Modal */}
            {isPackageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closePackageModal} />
                    <div className="w-full max-w-md bg-[#09090b] border border-neutral-800 rounded-[32px] overflow-hidden relative z-10 animate-in zoom-in-95 duration-500 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                        {/* Modal Header */}
                        <div className="relative p-7 pb-3">
                            <button 
                                onClick={closePackageModal} 
                                className="absolute right-6 top-6 p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-all border border-neutral-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-red-500">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Configuration</span>
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">
                                    {editingIndex !== null ? 'Tarifni Tahrirlash' : 'Yangi Tarif'}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-7 space-y-5 max-h-[55vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 group">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1">Paket Nomi</label>
                                    <input
                                        type="text"
                                        value={packageForm.tag}
                                        onChange={e => setPackageForm({ ...packageForm, tag: e.target.value.toUpperCase() })}
                                        placeholder="PREMIUM"
                                        className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-4 py-2.5 text-xs font-black text-white focus:border-red-500 outline-none transition-all uppercase"
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1">Narxi (So'm)</label>
                                    <input
                                        type="text"
                                        value={packageForm.price}
                                        onChange={e => setPackageForm({ ...packageForm, price: e.target.value })}
                                        placeholder="500 000"
                                        className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-4 py-2.5 text-xs font-black text-white focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 group">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1">Filiallar</label>
                                    <input
                                        type="text"
                                        value={packageForm.stores}
                                        onChange={e => setPackageForm({ ...packageForm, stores: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 1 })}
                                        className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-4 py-2.5 text-xs font-black text-white focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <label className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em] ml-1">Kassirlar</label>
                                    <input
                                        type="text"
                                        value={packageForm.cashiers}
                                        onChange={e => setPackageForm({ ...packageForm, cashiers: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 2 })}
                                        className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-4 py-2.5 text-xs font-black text-white focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Activity className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Status</p>
                                    <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-1">Sotuvga chiqarish</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={packageForm.isActive}
                                        onChange={e => setPackageForm({...packageForm, isActive: e.target.checked})}
                                    />
                                    <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-emerald-500" />
                                </label>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-7 pt-2 flex gap-3">
                            <button 
                                onClick={closePackageModal} 
                                className="flex-1 py-3 text-[10px] font-black text-neutral-600 hover:text-white transition-all uppercase tracking-widest border border-transparent hover:border-neutral-800 rounded-lg"
                            >
                                Bekor qilish
                            </button>
                            <button 
                                onClick={savePackage} 
                                className="flex-[1.5] py-3 bg-red-600 text-white rounded-xl text-[10px] font-black hover:bg-red-700 transition-all shadow-lg uppercase tracking-widest active:scale-95"
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
