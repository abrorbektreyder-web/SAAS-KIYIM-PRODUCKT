'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Camera, X, Check, CameraOff, RotateCcw } from 'lucide-react';

function ScannerModal({
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
        /* Overlay — shaffof qora fon, ortda kassir paneli ko'rinadi */
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            {/* Modal karta — markazda to'rtburchak */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#171717',
                    border: '1px solid #262626',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}
            >
                {/* Kamera video CSS */}
                <style>{`
                    .cam-modal video {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                        display: block !important;
                    }
                    .cam-modal > div {
                        width: 100% !important;
                        height: 100% !important;
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid #262626',
                    background: '#171717',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Camera style={{ width: 16, height: 16, color: '#3b82f6' }} />
                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Skanerlash</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#a3a3a3',
                        }}
                    >
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Kamera oynasi */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4/3',
                    background: '#000',
                    overflow: 'hidden',
                }}>
                    {/* Kamera yoqilgan */}
                    {cameraActive && !success && (
                        <>
                            <div className="cam-modal" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                <BarcodeScannerComponent
                                    width={500}
                                    height={500}
                                    onUpdate={handleUpdate}
                                    facingMode={facingMode}
                                />
                            </div>
                            {/* Skan ramkasi */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                {/* Qoraytirilgan chetlar */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.35) 15%, transparent 15%, transparent 85%, rgba(0,0,0,0.35) 85%), linear-gradient(to bottom, rgba(0,0,0,0.35) 15%, transparent 15%, transparent 85%, rgba(0,0,0,0.35) 85%)' }}></div>
                                <div style={{ width: '70%', maxWidth: 220, aspectRatio: '1', position: 'relative' }}>
                                    {/* Qizil skan chizig'i */}
                                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#ef4444', boxShadow: '0 0 8px rgba(255,0,0,0.5)', animation: 'scan 2s ease-in-out infinite' }}></div>
                                    {/* Burchaklar */}
                                    <div style={{ position: 'absolute', top: -1, left: -1, width: 24, height: 24, borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '4px 0 0 0' }}></div>
                                    <div style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 24, borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 4px 0 0' }}></div>
                                    <div style={{ position: 'absolute', bottom: -1, left: -1, width: 24, height: 24, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '0 0 0 4px' }}></div>
                                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 24, height: 24, borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 0 4px 0' }}></div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Muvaffaqiyat */}
                    {success && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                <Check style={{ width: 32, height: 32, color: '#34d399' }} />
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>O'qildi!</p>
                        </div>
                    )}

                    {/* Kamera o'chirilgan */}
                    {!cameraActive && !success && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <CameraOff style={{ width: 32, height: 32, color: '#525252' }} />
                            </div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Kamera o'chirilgan</p>
                            <p style={{ fontSize: 12, color: '#737373' }}>Pistalet skaner bilan ishlang</p>
                        </div>
                    )}
                </div>

                {/* Footer — tugmalar */}
                <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #262626',
                    background: '#171717',
                }}>
                    {cameraActive && !success ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    border: '1px solid #404040',
                                    background: 'transparent',
                                    color: '#d4d4d4',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                }}
                            >
                                <RotateCcw style={{ width: 15, height: 15 }} />
                                Burish
                            </button>
                            <button
                                onClick={() => setCameraActive(false)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: '#dc2626',
                                    color: '#fff',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                <CameraOff style={{ width: 15, height: 15 }} />
                                O'chirish
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    border: '1px solid #404040',
                                    background: 'transparent',
                                    color: '#d4d4d4',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                }}
                            >
                                <X style={{ width: 15, height: 15 }} />
                                Yopish
                            </button>
                        </div>
                    ) : !cameraActive ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => { setCameraActive(true); setSuccess(false); }}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: '#2563eb',
                                    color: '#fff',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                <RotateCcw style={{ width: 15, height: 15 }} />
                                Kamerani yoqish
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    border: '1px solid #404040',
                                    background: 'transparent',
                                    color: '#d4d4d4',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                }}
                            >
                                <X style={{ width: 15, height: 15 }} />
                                Yopish
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
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

    return createPortal(
        <ScannerModal onDetect={onDetect} onClose={onClose} />,
        document.body
    );
}
