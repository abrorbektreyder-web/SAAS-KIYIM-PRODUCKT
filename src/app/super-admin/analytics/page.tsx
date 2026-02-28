'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const monthlyRevenue = [
    { name: 'Okt', oylik: 12000000 },
    { name: 'Noy', oylik: 18000000 },
    { name: 'Dek', oylik: 25000000 },
    { name: 'Yan', oylik: 32000000 },
    { name: 'Fev', oylik: 42000000 },
];

const orgGrowth = [
    { name: 'Okt', tashkilotlar: 15 },
    { name: 'Noy', tashkilotlar: 35 },
    { name: 'Dek', tashkilotlar: 68 },
    { name: 'Yan', tashkilotlar: 112 },
    { name: 'Fev', tashkilotlar: 156 },
];

const planDistribution = [
    { name: "Starter", value: 85 },
    { name: "Business", value: 45 },
    { name: "Premium", value: 12 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

export default function SuperAdminAnalytics() {

    // Yordamchi formatter: million so'm
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div>
                <h1 className="text-2xl font-semibold text-white">Umumiy analitika (SAAS)</h1>
                <p className="text-sm text-neutral-400 mt-1">Loyiha barqarorligini va o'sishini tahlil qilish</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Oylik SAAS daromadi */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Oylik daromad o'sishi (So'm)</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#262626' }} contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Bar dataKey="oylik" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Platformaga ulangan do'konlar soni */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Yangi mijozlar (Do'konlar o'sishi)</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orgGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Line type="monotone" dataKey="tashkilotlar" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Tariflar bo'yicha taqsimot */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Tariflar taqsimoti</h2>
                    <div className="h-72 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {planDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
