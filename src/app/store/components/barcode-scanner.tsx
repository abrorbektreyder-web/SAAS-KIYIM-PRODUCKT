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
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-500" />
                        Skanerlash
                    </h3>
                    <div className="flex items-center gap-2">
                        {cameraActive && !success && (
                            <button
                                onClick={handleStopCamera}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 transition-colors"
                                title="Kamerani o'chirish"
                            >
                                <CameraOff className="w-3.5 h-3.5" />
                                <span>O'chirish</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
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
                            <button
                                onClick={handleRestartCamera}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Kamerani qayta yoqish
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-neutral-900 flex justify-between items-center text-sm border-t border-neutral-800">
                    {cameraActive && !success ? (
                        <>
                            <button
                                onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Kamerani burish
                            </button>
                            <p className="text-neutral-500 text-xs">Barkodni chiziq ichiga keltiring</p>
                        </>
                    ) : !cameraActive ? (
                        <p className="text-neutral-500 text-xs w-full text-center">
                            Pistalet skaner bilan shtrix-kodni skanerlang
                        </p>
                    ) : null}
                </div>

            </div>
        </div>
    );
}
