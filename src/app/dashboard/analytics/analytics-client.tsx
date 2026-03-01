'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import dynamic from 'next/dynamic';

const DownloadButton = dynamic(() => import('@/components/pdf/download-button'), { ssr: false });

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsClient({ orgId, initialData }: { orgId: string, initialData?: any }) {

    // Yordamchi formatter: 10000000 ni "10M" yoki "10 000 000" deb chiqarish uchun
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    const safeData = initialData || {
        monthlyData: [],
        customerGrowthData: [],
        paymentData: [],
        categoryData: [],
        topProducts: []
    };

    const topProducts = safeData.topProducts;
    const monthlyData = safeData.monthlyData;
    const customerGrowthData = safeData.customerGrowthData;
    const categoryData = safeData.categoryData;
    const paymentData = safeData.paymentData;

    const totalAmount = topProducts.reduce((acc: number, curr: any) => acc + (curr.sales * curr.price), 0);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analitika va Hisobot</h1>
                    <p className="text-sm text-neutral-500">Kompaniya va do'konlaringiz uchun chuqurlashtirilgan hisobotlar</p>
                </div>

                {/* PDF yuklash */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500">Hisobot (PDF)</span>
                    <DownloadButton data={topProducts} title="Eng ko'p sotilgan mahsulotlar reytingi" totalAmount={totalAmount} />
                </div>
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
                                    {categoryData.map((entry: any, index: number) => (
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
                                    {paymentData.map((entry: any, index: number) => (
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
                    {topProducts.map((item: any, idx: number) => (
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
