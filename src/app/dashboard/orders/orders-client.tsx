'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Loader2 } from 'lucide-react';
import { SalesReportPDF } from '@/components/dashboard/reports/SalesReportPDF';

interface OrdersClientProps {
    orders: any[];
    orgName: string;
}

export default function OrdersClient({ orders, orgName }: OrdersClientProps) {
    return (
        <div className="flex items-center gap-3">
            <PDFDownloadLink
                document={<SalesReportPDF orders={orders} orgName={orgName} dateRange="Barcha vaqtlar uchun" />}
                fileName={`hisobot_${new Date().toISOString().split('T')[0]}.pdf`}
            >
                {({ blob, url, loading, error }) => (
                    <button
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <FileDown className="h-4 w-4" />
                        )}
                        PDF Hisobot yuklash
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
