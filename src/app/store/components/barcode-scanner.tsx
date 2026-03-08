'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Camera, X, Check, CameraOff, RotateCcw } from 'lucide-react';

function ScannerOverlay({
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
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Kamera video — CSS orqali to'liq ekranga */}
            <style>{`
                .cam-wrap video {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
                .cam-wrap > div {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>

            {/* ====== KAMERA OYNASI ====== */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
                {/* Kamera yoqilgan */}
                {cameraActive && !success && (
                    <div className="cam-wrap" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <BarcodeScannerComponent
                            width={500}
                            height={500}
                            onUpdate={handleUpdate}
                            facingMode={facingMode}
                        />
                    </div>
                )}

                {/* Muvaffaqiyat */}
                {success && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Check style={{ width: 40, height: 40, color: '#34d399' }} />
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Barkod o'qildi!</p>
                        </div>
                    </div>
                )}

                {/* Kamera o'chirilgan */}
                {!cameraActive && !success && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                        <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                            <CameraOff style={{ width: 44, height: 44, color: '#737373' }} />
                        </div>
                        <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Kamera o'chirilgan</p>
                        <p style={{ fontSize: 14, color: '#737373', marginBottom: 24 }}>Pistalet skaner bilan ishlang</p>
                        <button
                            onClick={() => { setCameraActive(true); setSuccess(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer' }}
                        >
                            <RotateCcw style={{ width: 16, height: 16 }} />
                            Kamerani yoqish
                        </button>
                    </div>
                )}

                {/* Skan ramkasi */}
                {cameraActive && !success && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 240, height: 240, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#ef4444', boxShadow: '0 0 8px rgba(255,0,0,0.6)', animation: 'scan 2s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(96,165,250,0.4)', borderRadius: 8 }}></div>
                            {/* Burchaklar */}
                            <div style={{ position: 'absolute', top: -1, left: -1, width: 28, height: 28, borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '6px 0 0 0' }}></div>
                            <div style={{ position: 'absolute', top: -1, right: -1, width: 28, height: 28, borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 6px 0 0' }}></div>
                            <div style={{ position: 'absolute', bottom: -1, left: -1, width: 28, height: 28, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '0 0 0 6px' }}></div>
                            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 28, height: 28, borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 0 6px 0' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* ====== HEADER — yuqorida gradient ====== */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Camera style={{ width: 16, height: 16, color: '#60a5fa' }} />
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Skanerlash</span>
                </div>
                <button
                    onClick={onClose}
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff' }}
                >
                    <X style={{ width: 20, height: 20 }} />
                </button>
            </div>

            {/* ====== FOOTER — pastda tugmalar ====== */}
            {cameraActive && !success && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '40px 24px 28px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, maxWidth: 320, margin: '0 auto' }}>
                        {/* Burish */}
                        <button onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RotateCcw style={{ width: 20, height: 20, color: '#fff' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Burish</span>
                        </button>
                        {/* O'chirish */}
                        <button onClick={() => setCameraActive(false)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(220,38,38,0.4)' }}>
                                <CameraOff style={{ width: 22, height: 22, color: '#fff' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>O'chirish</span>
                        </button>
                        {/* Yopish */}
                        <button onClick={onClose} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X style={{ width: 20, height: 20, color: '#fff' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Yopish</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Kamera o'chirilgandagi yopish tugmasi */}
            {!cameraActive && !success && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '20px 24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onClose} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X style={{ width: 20, height: 20, color: '#fff' }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Yopish</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BarcodeScanner({
    onDetect,
    onClose
}: {
    onDetect: (code: string) => void,
    onClose: () => void
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    // createPortal orqali document.body ga render — header/sidebar ichida qolmaydi
    return createPortal(
        <ScannerOverlay onDetect={onDetect} onClose={onClose} />,
        document.body
    );
}
