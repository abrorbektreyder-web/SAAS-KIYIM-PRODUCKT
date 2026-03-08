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

    return (
        <div className="fixed inset-0 z-[200] bg-black">
            {/* Video'ni to'liq ekranga chiqarish uchun CSS */}
            <style>{`
                .scanner-video-area video {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
                .scanner-video-area > div {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>

            {/* Kamera — to'liq ekran background */}
            {cameraActive && !success && (
                <div className="scanner-video-area absolute inset-0">
                    <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={handleUpdate}
                        facingMode={facingMode}
                    />
                </div>
            )}

            {/* Muvaffaqiyat ekrani */}
            {success && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                    <div className="animate-scale-in flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </div>
                        <p className="text-lg font-semibold text-white">Barkod o'qildi!</p>
                    </div>
                </div>
            )}

            {/* Kamera o'chirilgan holat */}
            {!cameraActive && !success && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950">
                    <div className="w-24 h-24 rounded-full bg-neutral-800/80 flex items-center justify-center mb-5">
                        <CameraOff className="w-11 h-11 text-neutral-500" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Kamera o'chirilgan</p>
                    <p className="text-neutral-500 text-sm mb-6">Pistalet skaner bilan ishlang</p>
                    <button
                        onClick={() => { setCameraActive(true); setSuccess(false); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Kamerani yoqish
                    </button>
                </div>
            )}

            {/* Skan ramkasi overlay — faqat kamera yoqilganda */}
            {cameraActive && !success && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 sm:w-72 sm:h-72 relative">
                        {/* Qizil skan chizig'i */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-scan shadow-[0_0_8px_rgba(255,0,0,0.6)]"></div>
                        {/* Ko'k chiziqli ramka */}
                        <div className="absolute inset-0 border-2 border-dashed border-blue-400/40 rounded-lg"></div>
                        {/* Oq burchaklar */}
                        <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-md"></div>
                        <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-md"></div>
                        <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-md"></div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-md"></div>
                    </div>
                    {/* Matn — ramka ostida */}
                    <p className="absolute bottom-[30%] text-white/60 text-xs font-medium tracking-wide">
                        Barkodni ramka ichiga keltiring
                    </p>
                </div>
            )}

            {/* Yuqori panel — header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
                <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Skanerlash</span>
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Pastki panel — boshqaruv tugmalari */}
            {cameraActive && !success && (
                <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 pt-10 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-center gap-4 px-6 max-w-sm mx-auto">
                        <button
                            onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <RotateCcw className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] text-white/70 font-medium">Burish</span>
                        </button>

                        <button
                            onClick={() => setCameraActive(false)}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors">
                                <CameraOff className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] text-white/70 font-medium">O'chirish</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] text-white/70 font-medium">Yopish</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Kamera o'chirilgandagi pastki panel */}
            {!cameraActive && !success && (
                <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 pt-4">
                    <div className="flex items-center justify-center px-6 max-w-sm mx-auto">
                        <button
                            onClick={onClose}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] text-white/70 font-medium">Yopish</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
