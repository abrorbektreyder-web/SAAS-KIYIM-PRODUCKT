'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
    // QueryClient har foydalanuvchi uchun alohida yaratiladi (SSR xavfsiz)
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // 5 daqiqa davomida kesh saqlanadi — bazaga qayta-qayta bormaydi
                staleTime: 5 * 60 * 1000,
                // Brauzer tab ga qaytganda avtomatik refetch qilinmaydi
                refetchOnWindowFocus: false,
                // Xato bo'lsa 1 marta qayta urinib ko'radi
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
