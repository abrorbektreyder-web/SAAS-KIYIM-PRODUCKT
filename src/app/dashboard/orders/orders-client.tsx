'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Loader2, Calendar, ListFilter, Settings2, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SalesReportPDF } from '@/components/dashboard/reports/SalesReportPDF';

const statusColor: Record<string, string> = {
    new: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    preparing: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
};

const statusLabel: Record<string, string> = {
    new: 'Yangi', preparing: 'Tayyorlanmoqda', delivered: 'Topshirildi', cancelled: 'Bekor qilingan'
};

interface OrdersClientProps {
    orgId: string;
    orgName: string;
    initialOrders: any[];
}

export default function OrdersClient({ orgId, orgName, initialOrders }: OrdersClientProps) {
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<any[]>(initialOrders);
    const [ready, setReady] = useState(false);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        limit: '500'
    });

    const formatPrice = (amount: number) => {
        return amount.toLocaleString() + " so'm";
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handlePrepare = async () => {
        setLoading(true);
        setReady(false);
        try {
            const query = new URLSearchParams({
                orgId,
                startDate: filters.startDate,
                endDate: filters.endDate,
                limit: filters.limit
            });

            const res = await fetch(`/api/admin/orders?${query}`);
            const data = await res.json();

            if (res.ok) {
                setFilteredOrders(data);
                setReady(true);
            } else {
                alert(data.error || "Ma'lumot topilmadi");
            }
        } catch (e) {
            alert("Ulanish xatosi");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Haqiqatdan ham ushbu buyurtmani o'chirmoqchimisiz?")) return;
        
        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFilteredOrders(prev => prev.filter(o => o.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "O'chirishda xatolik");
            }
        } catch (e) {
            alert("Ulanish xatosi");
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!filters.startDate || !filters.endDate) {
            alert("Ommaviy o'chirish uchun 'Dan' va 'Gacha' sanalarini tanlang!");
            return;
        }

        const count = filteredOrders.length;
        if (!confirm(`DIQQAT! Tanlangan oraliqdagi barcha (${count} ta) buyurtmalar o'chirib yuboriladi. Tasdiqlaysizmi?`)) return;

        setLoading(true);
        try {
            const query = new URLSearchParams({
                orgId,
                startDate: filters.startDate,
                endDate: filters.endDate
            });

            const res = await fetch(`/api/admin/orders?${query}`, { method: 'DELETE' });
            if (res.ok) {
                setFilteredOrders([]);
                setReady(false);
                alert("Tanlangan oraliqdagi buyurtmalar muvaffaqiyatli o'chirildi.");
            } else {
                const data = await res.json();
                alert(data.error || "Ommaviy o'chirishda xatolik");
            }
        } catch (e) {
            alert("Ulanish xatosi");
        } finally {
            setLoading(false);
        }
    };

    const dateRangeLabel = filters.startDate && filters.endDate 
        ? `${filters.startDate} dan ${filters.endDate} gacha`
        : filters.startDate ? `${filters.startDate} dan keyingi`
        : filters.endDate ? `${filters.endDate} gacha`
        : "Barcha vaqtlar";

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-[#121214] border border-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <Settings2 className="w-5 h-5 text-blue-500" />
                        <h2 className="text-sm sm:text-base">PDF Hisobot va Ma'lumotlar</h2>
                    </div>
                    {ready && filters.startDate && filters.endDate && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors w-full sm:w-auto"
                        >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Tozalash ({filteredOrders.length} ta)
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Dan (Sana)
                        </label>
                        <input
                            type="date"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={filters.startDate}
                            onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setReady(false); }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Gacha (Sana)
                        </label>
                        <input
                            type="date"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={filters.endDate}
                            onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setReady(false); }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                            <ListFilter className="w-3.5 h-3.5" /> Ko'rsatish soni
                        </label>
                        <select
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                            value={filters.limit}
                            onChange={(e) => { setFilters({ ...filters, limit: e.target.value }); setReady(false); }}
                        >
                            <option value="50">Oxirgi 50 ta</option>
                            <option value="100">Oxirgi 100 ta</option>
                            <option value="200">Oxirgi 200 ta</option>
                            <option value="500">Oxirgi 500 ta</option>
                            <option value="1000">Oxirgi 1000 ta</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        {!ready ? (
                            <button
                                onClick={handlePrepare}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListFilter className="h-4 w-4" />}
                                Filtrlash
                            </button>
                        ) : (
                            <PDFDownloadLink
                                document={<SalesReportPDF orders={filteredOrders} orgName={orgName} dateRange={dateRangeLabel} />}
                                fileName={`hisobot_${filters.startDate || 'all'}_${filters.endDate || 'now'}.pdf`}
                                className="flex-1"
                            >
                                {({ blob, url, loading: pdfLoading, error }) => (
                                    <button
                                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
                                    >
                                        {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                                        PDF Hisobot ({filteredOrders.length})
                                    </button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders Table Section */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="border-b border-neutral-800 text-left text-xs text-neutral-500 uppercase tracking-wider">
                                <th className="px-5 py-4 font-semibold">Buyurtma №</th>
                                <th className="px-5 py-4 font-semibold">Mijoz</th>
                                <th className="px-5 py-4 font-semibold">To'lov</th>
                                <th className="px-5 py-4 font-semibold">Summa</th>
                                <th className="px-5 py-4 font-semibold">Sana</th>
                                <th className="px-5 py-4 font-semibold">Holat</th>
                                <th className="px-5 py-4 font-semibold text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-neutral-500">
                                        Buyurtmalar topilmadi.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors group">
                                        <td className="px-5 py-4 font-mono text-xs text-neutral-400 font-medium">{order.order_number}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-white">{order.customers?.full_name || '—'}</p>
                                            <p className="text-xs text-neutral-500">{order.customers?.phone || ''}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-neutral-400 capitalize bg-neutral-800/50 px-2 py-1 rounded text-xs">{order.payment_method}</span>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-white tracking-tight">{formatPrice(order.total)}</td>
                                        <td className="px-5 py-4 text-neutral-500 text-xs">{formatDate(order.created_at)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor[order.status] || ''}`}>
                                                {statusLabel[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                disabled={actionLoading === order.id}
                                                className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="O'chirish"
                                            >
                                                {actionLoading === order.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
