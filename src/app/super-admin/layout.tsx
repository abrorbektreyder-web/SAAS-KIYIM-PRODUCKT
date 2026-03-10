import SuperAdminSidebar from '@/components/layout/super-admin-sidebar';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-white">
            <SuperAdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative w-full">
                <header className="hidden lg:flex h-16 border-b border-neutral-800 bg-neutral-900/30 items-center justify-between px-8 w-full shrink-0">
                    <h1 className="text-sm font-medium text-neutral-300">HOYR Platformasi Boshqaruvi</h1>
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-[10px] ring-1 ring-red-500/50">SA</div>
                </header>
                <main className="flex-1 overflow-y-auto w-full p-4 pt-20 lg:p-8 lg:pt-8 bg-[#09090b]">
                    {children}
                </main>
            </div>
        </div>
    );
}
