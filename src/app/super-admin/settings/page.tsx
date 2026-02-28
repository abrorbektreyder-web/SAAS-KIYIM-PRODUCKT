'use client';

import { useState } from 'react';
import {
    Settings, CreditCard, Shield, Bell, Save,
    Database, Activity, Key, Globe, Mail, MessageSquare, Trash2, X
} from 'lucide-react';

type PackageItem = {
    tag: string;
    price: string;
    stores: number | 'Cheksiz';
    cashiers: number | 'Cheksiz';
    isActive: boolean;
};

const INITIAL_PACKAGES: PackageItem[] = [
    { tag: 'STARTER', price: '150 000', stores: 1, cashiers: 2, isActive: true },
    { tag: 'BUSINESS', price: '300 000', stores: 5, cashiers: 10, isActive: true },
    { tag: 'PREMIUM', price: '500 000', stores: 'Cheksiz', cashiers: 'Cheksiz', isActive: true },
];

export default function SuperAdminSettings() {
    const [activeTab, setActiveTab] = useState('tariflar'); // Changed to start at tariflar for your convenience
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Packages state
    const [packages, setPackages] = useState<PackageItem[]>(INITIAL_PACKAGES);

    // Modal state
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [packageForm, setPackageForm] = useState<PackageItem>({
        tag: '', price: '', stores: 1, cashiers: 2, isActive: true
    });

    // Saqlash (Imitatsiya)
    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
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
        if (!packageForm.tag || !packageForm.price) {
            alert("Iltimos, nomini va narxini kiriting");
            return;
        }

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
        if (confirm("Bu tarifni rostdan ham o'chirmoqchimisiz?")) {
            const newPackages = [...packages];
            newPackages.splice(index, 1);
            setPackages(newPackages);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Umumiy sozlamalar</h1>
                    <p className="text-sm text-neutral-400 mt-1">Platformani global darajada boshqarish va konfiguratsiya qilish</p>
                </div>

                <div className="flex items-center gap-3">
                    {saved && <span className="text-sm font-medium text-emerald-400 animate-fade-in">Muvaffaqiyatli saqlandi!</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-red-900/20"
                    >
                        {saving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-8">
                {/* ⬅️ Chaqiruvchi Tabs (Sidebar-like) */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('tizim')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'tizim' ? 'bg-red-500/10 text-red-500' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                                }`}
                        >
                            <Globe className="w-4 h-4" /> Asosiy axborotlar
                        </button>
                        <button
                            onClick={() => setActiveTab('tariflar')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'tariflar' ? 'bg-red-500/10 text-red-500' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                                }`}
                        >
                            <CreditCard className="w-4 h-4" /> Tariflar va narxlar
                        </button>
                        <button
                            onClick={() => setActiveTab('xavfsizlik')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'xavfsizlik' ? 'bg-red-500/10 text-red-500' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                                }`}
                        >
                            <Shield className="w-4 h-4" /> Xavfsizlik & Zaxira
                        </button>
                        <button
                            onClick={() => setActiveTab('xabarlar')}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'xabarlar' ? 'bg-red-500/10 text-red-500' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                                }`}
                        >
                            <Bell className="w-4 h-4" /> Xabarnomalar & SMTP
                        </button>
                    </div>
                </div>

                {/* ➡️ Kontekst maydoni */}
                <div className="flex-1 w-full max-w-4xl">

                    {/* TIZIM SOZLAMALARI */}
                    {activeTab === 'tizim' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden backdrop-blur-sm">
                                <div className="p-6 border-b border-neutral-800/50">
                                    <h3 className="text-lg font-medium text-white">Platforma identiteti</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Loyiha nomi, URL va aloqa ma'lumotlari logotipi.</p>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-neutral-400 mb-2 block uppercase tracking-wider">Platforma nomi</label>
                                            <input type="text" defaultValue="HOYR" className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700 text-sm text-white px-4 py-2.5 outline-none focus:border-red-500 transition-colors focus:bg-neutral-800" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-neutral-400 mb-2 block uppercase tracking-wider">Asosiy Domen (URL)</label>
                                            <input type="text" defaultValue="https://hoyr.uz" className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700 text-sm text-white px-4 py-2.5 outline-none focus:border-red-500 transition-colors focus:bg-neutral-800" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-neutral-400 mb-2 block uppercase tracking-wider">Mijozlarni qo'llab-quvvatlash emaili</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <input type="email" defaultValue="support@hoyr.uz" className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700 text-sm text-white pl-10 pr-4 py-2.5 outline-none focus:border-red-500 transition-colors focus:bg-neutral-800" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-neutral-400 mb-2 block uppercase tracking-wider">Loyiha Tavsifi (SEO)</label>
                                        <textarea rows={3} defaultValue="HOYR B2B Platformasi - Butiklar va kiyim do'konlarini boshqarish uchun eng qulay SAAS yechimi." className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700 text-sm text-white px-4 py-2.5 outline-none focus:border-red-500 transition-colors focus:bg-neutral-800" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TARIFLAR VA LIMITLAR */}
                    {activeTab === 'tariflar' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden backdrop-blur-sm">
                                <div className="p-6 border-b border-neutral-800/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Tariflar strukturasi (Paketlar)</h3>
                                        <p className="text-sm text-neutral-500 mt-1">Mijozlaringiz uchun SAAS obuna rejalarini qiymatlash</p>
                                    </div>
                                    <button
                                        onClick={() => openPackageModal()}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"
                                    >
                                        + Yangi paket
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {packages.map((v, index) => (
                                            <div key={index} className="border border-neutral-800 rounded-xl bg-neutral-800/20 flex flex-col items-center p-5 text-center relative group hover:border-neutral-600 transition-colors">
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openPackageModal(index)}
                                                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md cursor-pointer transition text-neutral-400 hover:text-white"
                                                    >
                                                        <Settings className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePackage(index)}
                                                        className="p-1.5 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-md cursor-pointer transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <span className="text-[10px] font-bold tracking-widest text-neutral-400 mb-2 uppercase">{v.tag}</span>
                                                <div className="text-2xl font-bold text-white tracking-tight">{v.price}<span className="text-sm text-neutral-500 font-normal"> /oy</span></div>
                                                <div className="w-full border-t border-neutral-800/50 my-4"></div>
                                                <div className="text-xs text-neutral-400 space-y-2 w-full text-left">
                                                    <div className="flex justify-between items-center"><span>Filiallar:</span> <span className="text-white font-medium">{v.stores}</span></div>
                                                    <div className="flex justify-between items-center"><span>Kassirlar:</span> <span className="text-white font-medium">{v.cashiers}</span></div>
                                                    <div className="flex justify-between items-center"><span>Tex qo'llab:</span> <span className="text-white font-medium">{v.price.includes('500') ? '24/7' : 'Standart'}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="text-sm font-semibold text-white mb-4">Integratsiyalangan To'lov tizimlari</h4>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-3 p-3 border border-emerald-500/30 bg-emerald-500/5 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
                                                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                                <span className="text-sm font-medium text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-500" /> Payme / Click</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-neutral-800 bg-neutral-900/50 rounded-xl cursor-pointer hover:border-neutral-700 transition">
                                                <input type="checkbox" className="accent-red-500 w-4 h-4 cursor-pointer" />
                                                <span className="text-sm font-medium text-neutral-300">Stripe (Kelajakda)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* XAVFSIZLIK & DB */}
                    {activeTab === 'xavfsizlik' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden backdrop-blur-sm">
                                <div className="p-6 border-b border-neutral-800/50">
                                    <h3 className="text-lg font-medium text-white">Xavfsizlik va zaxiralash</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Platforma barqarorligi va ma'lumotlar xavfsizligi.</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* 2FA */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-white flex items-center gap-2"><Key className="w-4 h-4 text-emerald-400" /> Ikki bosqichli himoya (2FA)</h4>
                                            <p className="text-xs text-neutral-400 mt-1 max-w-sm">Super Admin sahifasiga kirishda majburiy SMS yoki Authenticator kodini so'rash.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                        </label>
                                    </div>
                                    <hr className="border-neutral-800/50" />
                                    {/* Backups */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-white flex items-center gap-2"><Database className="w-4 h-4 text-blue-400" /> Kunlik Avtomatik Zaxira (Database Backup)</h4>
                                            <p className="text-xs text-neutral-400 mt-1 max-w-sm">Barcha tashkilotlarning ma'lumotlar bazasi zaxirasini bulutli serverlarga saqlash.</p>
                                        </div>
                                        <select className="bg-neutral-800 border-none text-xs text-white p-2 rounded-lg cursor-pointer outline-none ring-1 ring-neutral-700 focus:ring-red-500 transition-shadow">
                                            <option>Har 12 soatda</option>
                                            <option>Har kuni soat 23:59 da</option>
                                            <option>Haftada 1 marta</option>
                                        </select>
                                    </div>
                                    <hr className="border-neutral-800/50" />
                                    {/* API */}
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Root API Keys (Supabase/Vercel)</h4>
                                        <p className="text-xs text-neutral-400 mt-1 mb-3">Admin huquqiga ega tashqi API kalitlarini yashirin holda kiritish.</p>
                                        <div className="flex gap-3">
                                            <input type="password" value="****************************************" readOnly className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700 font-mono text-sm text-neutral-500 px-4 py-2 outline-none" />
                                            <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm shrink-0 border border-neutral-700 transition">Regenerate</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* XABARNOMALAR */}
                    {activeTab === 'xabarlar' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden backdrop-blur-sm">
                                <div className="p-6 border-b border-neutral-800/50">
                                    <h3 className="text-lg font-medium text-white">Xabarnomalar va jo'natmalar</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Platformadagi voqealarga nisbatan bildirishnomalarni sozlash.</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border border-neutral-800 p-5 rounded-xl bg-neutral-800/20">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-neutral-800 rounded-lg"><Mail className="w-5 h-5 text-neutral-300" /></div>
                                                <h4 className="font-semibold text-white">Email (SMTP)</h4>
                                            </div>
                                            <p className="text-xs text-neutral-500 mb-4 line-clamp-2">"Parolni tiklash" va "Do'kon muvaffaqiyatli ochildi" kabi xabar tizimlari uchun SMTP.</p>
                                            <div className="space-y-3">
                                                <input type="text" placeholder="SMTP Host (smtp.gmail.com)" defaultValue="smtp.gmail.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors" />
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="Port" defaultValue="587" className="w-1/3 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors" />
                                                    <input type="password" placeholder="App Password" defaultValue="password123!" className="w-2/3 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border border-neutral-800 p-5 rounded-xl bg-neutral-800/20">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-500/10 rounded-lg"><MessageSquare className="w-5 h-5 text-blue-400" /></div>
                                                <h4 className="font-semibold text-white">Telegram Bot integration</h4>
                                            </div>
                                            <p className="text-xs text-neutral-500 mb-4 line-clamp-2">Super Admin guruhiga yoki maxsus ID ga xabarlar (Yangi mijozlar to'lovi) jo'natish.</p>
                                            <div className="space-y-3">
                                                <input type="text" placeholder="Bot Token" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors" />
                                                <input type="text" placeholder="Admin Chat ID" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors" />
                                                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors mt-2">Ulanishni tekshirish</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-3 mt-4">Tizim Ogohlantirishlari (Triggerlar)</h4>
                                        <div className="space-y-2">
                                            {[
                                                'Yangi SAAS foydalanuvchisi ro\'yxatdan o\'tsa - xabar jo\'natish',
                                                'Mijozning tarif to\'lovi muddati tugashiga 3 kun qolganda - eslatish',
                                                'Katta tranzaksiyalar bo\'lganda (M-n: Premium to\'lovda) - Super Adminga xabar berish'
                                            ].map((text, i) => (
                                                <label key={i} className="flex flex-row items-center gap-3 p-3 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition">
                                                    <input type="checkbox" defaultChecked className="accent-red-500 w-4 h-4 cursor-pointer" />
                                                    <span className="text-xs text-neutral-300">{text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PACKAGE MODAL */}
            {isPackageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden animate-fade-in custom-modal">
                        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
                            <h2 className="text-lg font-semibold text-white">
                                {editingIndex !== null ? 'Tarifni tahrirlash' : 'Yangi tarif qo\'shish'}
                            </h2>
                            <button
                                onClick={closePackageModal}
                                className="text-neutral-400 hover:text-white transition-colors bg-neutral-800/50 hover:bg-neutral-800 p-1.5 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-xs text-neutral-400 mb-1.5 block">Paket nomi (M-n: VIP)</label>
                                <input
                                    type="text"
                                    value={packageForm.tag}
                                    onChange={e => setPackageForm({ ...packageForm, tag: e.target.value.toUpperCase() })}
                                    placeholder="STARTER"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:bg-neutral-800/80 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1.5 block">Narxi (So'm / oy)</label>
                                <input
                                    type="text"
                                    value={packageForm.price}
                                    onChange={e => setPackageForm({ ...packageForm, price: e.target.value })}
                                    placeholder="150 000"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:bg-neutral-800/80 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1.5 block">Ruxsat: Filiallar (Soni)</label>
                                    <input
                                        type="text"
                                        value={packageForm.stores}
                                        onChange={e => setPackageForm({ ...packageForm, stores: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 0 })}
                                        placeholder="M-n: 1 yoki Cheksiz"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:bg-neutral-800/80 transition-all"
                                    />
                                    <p className="text-[10px] text-neutral-500 mt-1">Sms yozish uchun: "Cheksiz"</p>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1.5 block">Ruxsat: Kassirlar (Soni)</label>
                                    <input
                                        type="text"
                                        value={packageForm.cashiers}
                                        onChange={e => setPackageForm({ ...packageForm, cashiers: e.target.value === 'Cheksiz' ? 'Cheksiz' : parseInt(e.target.value) || 0 })}
                                        placeholder="M-n: 2 yoki Cheksiz"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:bg-neutral-800/80 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-neutral-800/40 border border-neutral-800 hover:bg-neutral-800/80 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={packageForm.isActive}
                                        onChange={e => setPackageForm({ ...packageForm, isActive: e.target.checked })}
                                        className="accent-red-500 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-neutral-300">Bu tarif tizimda faolmi ochiqmi?</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/50">
                            <button
                                onClick={closePackageModal}
                                className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors hover:bg-neutral-800 rounded-lg"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={savePackage}
                                className="px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
