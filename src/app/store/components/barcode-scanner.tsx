'use client';

import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Camera, X, Check, CameraOff, RotateCcw } from 'lucide-react';

export default function BarcodeScanner({
    onDetect,
    onClose
}: {
    onDetect: (code: string) => void,
    onClose: () => void
}) {
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [success, setSuccess] = useState(false);
    const [cameraActive, setCameraActive] = useState(true);

    const handleUpdate = (err: any, result: any) => {
        if (result && !success && cameraActive) {
            setSuccess(true);
            onDetect(result.text);
            setTimeout(() => {
                onClose();
            }, 600);
        }
    };

    const handleStopCamera = () => {
        setCameraActive(false);
    };

    const handleRestartCamera = () => {
        setSuccess(false);
        setCameraActive(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-neutral-800">
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                        <Camera className="w-4 h-4 text-blue-500" />
                        Skanerlash
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
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
                    ) : cameraActive ? (
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
                    ) : (
                        /* Kamera o'chirilgan holat */
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                            <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center">
                                <CameraOff className="w-10 h-10 text-neutral-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium mb-1">Kamera o'chirilgan</p>
                                <p className="text-neutral-500 text-xs">Pistalet skaner bilan ishlashingiz mumkin</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls - ASOSIY TUGMALAR SHU YERDA */}
                <div className="p-3 bg-neutral-900 border-t border-neutral-800 space-y-2">
                    {cameraActive && !success ? (
                        <>
                            {/* Kamerani boshqarish tugmalari */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors text-sm"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Burish
                                </button>
                                <button
                                    onClick={handleStopCamera}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors text-sm"
                                >
                                    <CameraOff className="w-4 h-4" />
                                    Kamerani o'chirish
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors text-xs"
                            >
                                <X className="w-3.5 h-3.5" />
                                Yopish
                            </button>
                        </>
                    ) : !cameraActive ? (
                        <>
                            <button
                                onClick={handleRestartCamera}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Kamerani qayta yoqish
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors text-xs"
                            >
                                <X className="w-3.5 h-3.5" />
                                Yopish
                            </button>
                            <p className="text-neutral-500 text-xs text-center mt-1">
                                Pistalet skaner bilan shtrix-kodni skanerlang
                            </p>
                        </>
                    ) : null}
                </div>

            </div>
        </div>
    );
}

