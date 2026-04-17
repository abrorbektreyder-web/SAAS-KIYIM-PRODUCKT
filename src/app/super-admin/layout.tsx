import SuperAdminSidebar from '@/components/layout/super-admin-sidebar';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#09090b] text-white">
            <SuperAdminSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-neutral-800 bg-neutral-900/30 flex items-center justify-between px-8">
                    <h1 className="text-sm font-medium text-neutral-300">HOYR Platformasi Boshqaruvi</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs ring-1 ring-red-500/50">SA</div>
                    </div>
                </header>
                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
