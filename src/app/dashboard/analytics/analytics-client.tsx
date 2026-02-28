'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const monthlyData = [
    { name: 'Yan', sotuv: 12000000 },
    { name: 'Fev', sotuv: 19000000 },
    { name: 'Mar', sotuv: 15000000 },
    { name: 'Apr', sotuv: 23000000 },
    { name: 'May', sotuv: 21000000 },
    { name: 'Iyn', sotuv: 32000000 },
];

const customerGrowthData = [
    { name: 'Yan', customers: 45 },
    { name: 'Fev', customers: 85 },
    { name: 'Mar', customers: 120 },
    { name: 'Apr', customers: 180 },
    { name: 'May', customers: 240 },
    { name: 'Iyn', customers: 310 },
];

const categoryData = [
    { name: "Ko'ylaklar", value: 400 },
    { name: "Shimlar", value: 300 },
    { name: "Poyabzallar", value: 300 },
    { name: "Aksessuarlar", value: 200 },
];

const paymentData = [
    { name: "Naqd", value: 65 },
    { name: "Plastik", value: 35 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsClient({ orgId }: { orgId: string }) {

    // Yordamchi formatter: 10000000 ni "10M" yoki "10 000 000" deb chiqarish uchun
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div>
                <h1 className="text-2xl font-bold text-white">Analitika</h1>
                <p className="text-sm text-neutral-500">Kompaniya va do'konlaringiz uchun chuqurlashtirilgan hisobotlar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Oylik sotuvlar (BarChart) */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Oylik aylanma (Sotuv hajmi)</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickFormatter={formatCurrency}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#262626' }}
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="sotuv" fill="#ffffff" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Mijozlar o'sishi (LineChart) */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Yangi mijozlar o'sishi</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="customers"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Kategoriyalar bo'yicha sotilish (PieChart) */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">Turkumlar bo'yicha daromad ulushi</h2>
                    <div className="h-72 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Sotuv Kanallari (Donut/Pie) */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-white mb-6">To'lov yo'nalishlari</h2>
                    <div className="h-72 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    stroke="none"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {paymentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#a855f7'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top mahsulotlar ro'yxati (Oddiy HTML) */}
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Top 5 xaridgir mahsulotlar</h2>
                <div className="space-y-4">
                    {[
                        { name: "Klassik qora kurtka", sales: 124, price: 450000 },
                        { name: "Oq kedalar", sales: 98, price: 320000 },
                        { name: "Kuzgi sviter (Bej)", sales: 85, price: 210000 },
                        { name: "Jinsi shim (Slim fit)", sales: 74, price: 380000 },
                        { name: "Qishki qalpoq", sales: 62, price: 95000 },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/70 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 border border-neutral-700 font-bold text-neutral-400">
                                    #{idx + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-white text-sm">{item.name}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{item.sales} ta sotilgan</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-white">{(item.sales * item.price).toLocaleString()} so'm</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
