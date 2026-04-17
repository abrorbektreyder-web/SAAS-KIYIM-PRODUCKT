'use client';

import { useState, useEffect } from 'react';

export default function RealTimeClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!time) return <div className="h-[44px]" />; // Reserve space

    return (
        <div className="flex flex-col items-end animate-in fade-in duration-500">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] leading-none mb-1">Live Terminal</p>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-tighter tabular-nums">
                    {time.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex flex-col gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest mt-1 tabular-nums">
                {time.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
        </div>
    );
}
