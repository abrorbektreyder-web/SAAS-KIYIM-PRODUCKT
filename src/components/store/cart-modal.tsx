'use client';

import { useState } from 'react';
import { X, Minus, Plus, Trash2, CreditCard, Banknote, ScanBarcode, Printer, CheckCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatStorePrice } from '@/lib/store-data';
import Image from 'next/image';

type PaymentMethod = 'naqd' | 'karta' | null;

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
    const [payMethod, setPayMethod] = useState<PaymentMethod>(null);
    const [paid, setPaid] = useState(false);
    const [printing, setPrinting] = useState(false);

    if (!open) return null;

    const handlePay = async () => {
        if (!payMethod) return;
        setPaid(true);
        // Kelajakda: printer ga chek yuborish
        // Kelajakda: scanner bilan tovar qoldig'ini kamaytirish
        // Hozir: demo rejimda 2 soniya kutiladi
        setPrinting(true);
        await new Promise((r) => setTimeout(r, 2000));
        setPrinting(false);
    };

    const handleNewSale = () => {
        clearCart();
        setPaid(false);
        setPayMethod(null);
        onClose();
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-semibold text-white">
                            {paid ? '✅ To\'lov muvaffaqiyatli!' : 'Savat'}
                        </h2>
                        {!paid && <p className="text-xs text-neutral-500">{totalItems} ta mahsulot</p>}
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {paid ? (
                    /* To'lov muvaffaqiyatli */
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-6">
                        <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">To'lov qabul qilindi!</h3>
                        <p className="text-sm text-neutral-400 mb-1">
                            Jami: <span className="text-white font-bold">{formatStorePrice(totalPrice)}</span>
                        </p>
                        <p className="text-sm text-neutral-400 mb-1">
                            To'lov usuli: <span className="text-white">{payMethod === 'naqd' ? 'Naqd pul' : 'Karta'}</span>
                        </p>

                        {/* Scanner/Printer holati */}
                        <div className="mt-6 w-full space-y-2">
                            <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/50 px-4 py-3">
                                <Printer className={`h-5 w-5 ${printing ? 'text-amber-400 animate-pulse' : 'text-green-400'}`} />
                                <div>
                                    <p className="text-sm text-white">{printing ? 'Chek chop etilmoqda...' : 'Chek chop etildi'}</p>
                                    <p className="text-xs text-neutral-500">Printer ulanganda avtomatik chiqadi</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/50 px-4 py-3">
                                <ScanBarcode className="h-5 w-5 text-green-400" />
                                <div>
                                    <p className="text-sm text-white">Tovar qoldig'i yangilandi</p>
                                    <p className="text-xs text-neutral-500">{totalItems} ta mahsulot ombordan ayirildi</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleNewSale} className="mt-6 w-full rounded-lg bg-white py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors">
                            Yangi sotuv
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-16">
                        <p className="text-neutral-500">Savat bo'sh</p>
                    </div>
                ) : (
                    <>
                        {/* Mahsulotlar ro'yxati */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-800/40 p-3">
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                                        <p className="text-xs text-neutral-400">{formatStorePrice(item.product.price)} × {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded-md border border-neutral-700 p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded-md border border-neutral-700 p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => removeItem(item.product.id)} className="ml-1 rounded-md p-1 text-neutral-500 hover:bg-red-900/30 hover:text-red-400 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="w-24 text-right text-sm font-bold text-white">{formatStorePrice(item.product.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pastki qism: jami + to'lov */}
                        <div className="border-t border-neutral-800 px-6 py-4 flex-shrink-0 space-y-4">
                            {/* Jami */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-400">Jami summa:</span>
                                <span className="text-xl font-bold text-white">{formatStorePrice(totalPrice)}</span>
                            </div>

                            {/* To'lov usuli */}
                            <div>
                                <p className="mb-2 text-xs font-medium text-neutral-500 uppercase">To'lov usuli</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPayMethod('naqd')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${payMethod === 'naqd'
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
                                            }`}
                                    >
                                        <Banknote className="h-5 w-5" />
                                        Naqd pul
                                    </button>
                                    <button
                                        onClick={() => setPayMethod('karta')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${payMethod === 'karta'
                                                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
                                            }`}
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        Karta
                                    </button>
                                </div>
                            </div>

                            {/* Scanner info */}
                            <div className="flex items-center gap-2 rounded-lg bg-neutral-800/60 px-3 py-2">
                                <ScanBarcode className="h-4 w-4 text-neutral-500" />
                                <span className="text-xs text-neutral-500">Shtrix-kod skaneri ulangan bo'lsa, avtomatik qo'shiladi</span>
                            </div>

                            {/* To'lov tugmasi */}
                            <button
                                onClick={handlePay}
                                disabled={!payMethod}
                                className="w-full rounded-lg bg-white py-3 text-sm font-bold text-black transition-all hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {payMethod === 'naqd' ? '💵' : payMethod === 'karta' ? '💳' : '💰'} To'lov qilish — {formatStorePrice(totalPrice)}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
