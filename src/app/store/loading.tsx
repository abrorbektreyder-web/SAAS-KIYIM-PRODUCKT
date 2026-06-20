import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex h-[60vh] w-full items-center justify-center animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-3 text-neutral-400">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="text-sm font-medium animate-pulse">Ma'lumotlar yuklanmoqda...</p>
            </div>
        </div>
    );
}
