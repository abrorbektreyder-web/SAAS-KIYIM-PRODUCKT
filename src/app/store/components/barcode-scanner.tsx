'use client';

import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Camera, X, Check, Search } from 'lucide-react';

export default function BarcodeScanner({
    onDetect,
    onClose
}: {
    onDetect: (code: string) => void,
    onClose: () => void
}) {
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [success, setSuccess] = useState(false);

    const handleUpdate = (err: any, result: any) => {
        if (result && !success) {
            setSuccess(true);
            onDetect(result.text);
            setTimeout(() => {
                onClose();
            }, 600); // Muvaffaqiyat belgisini ko'rsatib keyin yopadi
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-500" />
                        Skanerlash
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Camera / Scanner Area */}
                <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
                    {success ? (
                        <div className="flex flex-col items-center justify-center text-emerald-500 animate-scale-in">
                            <Check className="w-16 h-16 mb-2" />
                            <p className="font-medium text-white">O'qildi!</p>
                        </div>
                    ) : (
                        <>
                            <BarcodeScannerComponent
                                width={500}
                                height={500}
                                onUpdate={handleUpdate}
                                facingMode={facingMode}
                            />
                            {/* O'qish chizig'i va dizayn */}
                            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                                <div className="w-full h-full border-2 border-dashed border-blue-500/50 relative">
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-scan shadow-[0_0_10px_red]"></div>

                                    {/* Burchaklar */}
                                    <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-white"></div>
                                    <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-white"></div>
                                    <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-white"></div>
                                    <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-white"></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-neutral-900 flex justify-between items-center text-sm">
                    <button
                        onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        Kamerani burish
                    </button>
                    <p className="text-neutral-500 text-xs">Barkodni chiziq ichiga keltiring</p>
                </div>

            </div>
        </div>
    );
}
