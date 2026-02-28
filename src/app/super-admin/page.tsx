'use client';

import { Building2, Store, CreditCard, Rocket, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Super Admin Paneli</h1>
                <p className="text-sm text-neutral-400 mt-1">Platforma holati bo'yicha umumiy ko'rsatkichlar</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Jami do'konlar</p>
                            <h3 className="text-3xl font-bold text-white mt-2">156</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <TrendingUp className="w-3 h-3" />
                                <span>+12% o'tgan oydan</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 2 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Faol do'konlar</p>
                            <h3 className="text-3xl font-bold text-white mt-2">142</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <span>91% umumiy</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Store className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 3 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Oylik daromad</p>
                            <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">42 mln</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <TrendingUp className="w-3 h-3" />
                                <span>+18% o'tgan oydan</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <CreditCard className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* 4 */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Yangi (bu oy)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">8</h3>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
                                <TrendingUp className="w-3 h-3" />
                                <span>+33% o'sish</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <Rocket className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Qo'shimcha bloklar ketishi mumkin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">So'nggi a'zo bo'lganlar</h3>
                    <p className="text-sm text-neutral-500">Iltimos ma'lumotlar bazasini ulang (Bosqich 2.2)</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Eng so'nggi to'lovlar</h3>
                    <p className="text-sm text-neutral-500">Iltimos ma'lumotlar bazasini ulang (Bosqich 2.2)</p>
                </div>
            </div>

        </div>
    );
}
