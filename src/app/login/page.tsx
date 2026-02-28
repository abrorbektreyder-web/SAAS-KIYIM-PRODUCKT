'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Store } from 'lucide-react';
import HoyrLogo from '@/components/ui/hoyr-logo';
import Link from 'next/link';
import { signIn } from '@/lib/supabase/auth';

export default function KassirLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('kassir@hoyr.uz');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { profile } = await signIn(email, password);
            if (profile?.role === 'cashier') {
                router.push('/store');
            } else {
                setError("Sizda kassir huquqi yo'q.");
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Login xatosi ro\'y berdi');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4">
            <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-neutral-900 via-[#09090b] to-neutral-900" />

            <div className="relative w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-3">
                        <HoyrLogo size="lg" />
                    </div>
                    <p className="text-sm text-neutral-500">Kiyim do'koni boshqaruv tizimi</p>
                </div>

                {/* Rol ko'rsatgich */}
                <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3">
                    <Store className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Do'kon kassir paneli</span>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-md">
                    <h2 className="mb-1 text-lg font-semibold text-white">Kassir kirishi</h2>
                    <p className="mb-6 text-xs text-neutral-500">Sotuv va kassa uchun</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Email manzil</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                                placeholder="kassir@hoyr.uz" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">Parol</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-neutral-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</p>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Kirilmoqda...' : '🏪 Kassir sifatida kirish'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-neutral-600">Demo: istalgan parol (3+ belgi)</p>
                </div>

                {/* Admin link */}
                <div className="mt-4 text-center">
                    <Link href="/login/admin" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
                        Admin sifatida kirish →
                    </Link>
                </div>

                <p className="mt-3 text-center text-xs text-neutral-700">© 2026 HOYR. Barcha huquqlar himoyalangan.</p>
            </div>
        </div>
    );
}
