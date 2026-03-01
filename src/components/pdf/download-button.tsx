'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { SalesReportPDF } from './sales-report';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DownloadButton({ data, title, totalAmount }: { data: any[], title: string, totalAmount: number }) {
    // SSR xavfini oldini olish uchun
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="w-10 h-10" />; // Placehoder

    return (
        <PDFDownloadLink
            document={<SalesReportPDF data={data} title={title} totalAmount={totalAmount} />}
            fileName={`report-${Date.now()}.pdf`}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
            {({ loading }) => (loading ?
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin"></div>
                : <Download className="h-5 w-5" />
            )}
        </PDFDownloadLink>
    );
}
