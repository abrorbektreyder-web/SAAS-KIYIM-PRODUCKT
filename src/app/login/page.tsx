'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('admin@hoyr.uz');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Demo: har qanday parol bilan kirish
        await new Promise((r) => setTimeout(r, 800));
        if (password.length < 3) {
            setError('Parol noto\'g\'ri. (Kamida 3 belgi kiriting)');
            setLoading(false);
            return;
        }
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4">
            {/* Background gradient */}
            <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-neutral-900 via-[#09090b] to-neutral-900" />

            <div className="relative w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
                        <ShoppingBag className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest text-white uppercase">&#123;HOYR&#125;</h1>
                    <p className="mt-1 text-sm text-neutral-500">Kiyim do'koni boshqaruv tizimi</p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-md">
                    <h2 className="mb-6 text-lg font-semibold text-white">Tizimga kirish</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                                Email manzil
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                                placeholder="email@misol.uz"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                                Parol
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                                >
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Kirilmoqda...' : 'Kirish'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-neutral-600">
                        Demo: istalgan parol (3+ belgi)
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-neutral-700">
                    © 2026 &#123;HOYR&#125;. Barcha huquqlar himoyalangan.
                </p>
            </div>
        </div>
    );
}
