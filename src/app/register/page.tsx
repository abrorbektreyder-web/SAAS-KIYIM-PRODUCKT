'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, User, Phone, Mail, Lock, Building2, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'
import HoyrLogo from '@/components/ui/hoyr-logo'
import { signIn } from '@/lib/supabase/auth'

export default function RegisterPage() {
    const router = useRouter()

    const [step, setStep] = useState(1) // 1: Info, 2: Plan
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        orgName: '',
        fullName: '',
        phone: '',
        email: '',
        password: '',
        plan: 'starter'
    })

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.orgName || !form.fullName || !form.phone || !form.email || !form.password) {
            setError("Barcha maydonlarni to'ldiring")
            return
        }
        setError('')
        setStep(2)
    }

    const handleRegister = async () => {
        try {
            setLoading(true)
            setError('')

            // 1. Yangi akkaunt va tashkilotni yaratish API
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Server xatosi')

            // 2. Muvaffaqiyatli bolsa, tizimga kirish
            await signIn(form.email, form.password)

            // 3. /dashboard ga yo'naltirish
            router.push('/dashboard')
            router.refresh()

        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#09090b]">
            {/* Chap tomon - Ma'lumot va Banner */}
            <div className="hidden w-1/2 flex-col justify-between bg-neutral-900 border-r border-neutral-800 p-12 lg:flex relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none" />
                <div className="relative z-10">
                    <HoyrLogo />
                </div>
                <div className="relative z-10 max-w-md">
                    <h1 className="mb-6 text-4xl font-bold text-white leading-tight">Biznesingizni keyingi bosqichga olib chiqing</h1>
                    <p className="text-lg text-neutral-400 mb-8">HOYR platformasi orqali do'koningiz va filiallar tarmog'ini oson, tez va xavfsiz boshqaring.</p>

                    <ul className="space-y-4">
                        <li className="flex items-center text-neutral-300">
                            <CheckCircle2 className="mr-3 h-5 w-5 text-blue-500" /> 14 kunlik bepul sinov muddati
                        </li>
                        <li className="flex items-center text-neutral-300">
                            <CheckCircle2 className="mr-3 h-5 w-5 text-blue-500" /> 24/7 yordam va qullab quvvatlash
                        </li>
                        <li className="flex items-center text-neutral-300">
                            <CheckCircle2 className="mr-3 h-5 w-5 text-blue-500" /> Barcha platformalarga mos
                        </li>
                    </ul>
                </div>
                <div className="relative z-10 flex items-center gap-4 text-sm text-neutral-500">
                    <span>© {new Date().getFullYear()} HOYR</span>
                    <Link href="#" className="hover:text-white transition-colors">Maxfiylik siyosati</Link>
                    <Link href="#" className="hover:text-white transition-colors">Foydalanish shartlari</Link>
                </div>
            </div>

            {/* O'ng tomon - Ro'yxatdan o'tish formasi */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 relative">
                {/* Mobile logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <HoyrLogo />
                </div>

                <div className="w-full max-w-md">
                    {step === 1 ? (
                        <div className="animate-fade-in text-white/90">
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-white">Xush kelibsiz!</h2>
                                <p className="text-neutral-400">Do'koningizni tizimga qo'shamiz</p>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleNextStep} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 flex items-center">
                                        Do'kon/tashkilot nomi <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Store className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 pl-10 text-white placeholder-neutral-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Masalan: Baraka Omad"
                                            value={form.orgName}
                                            onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 flex items-center">
                                        To'liq ismingiz <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <User className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 pl-10 text-white placeholder-neutral-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Masalan: Sardor Rustamov"
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 flex items-center">
                                        Telefon raqam <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Phone className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 pl-10 text-white placeholder-neutral-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="+998 90 123 45 67"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 flex items-center">
                                        Email manzil (Login uchun) <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Mail className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 pl-10 text-white placeholder-neutral-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="admin@baraka.uz"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400 flex items-center">
                                        Parol o'ylab toping <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 pl-10 text-white placeholder-neutral-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Kamida 6ta belgi hrf va son:"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 p-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    Keyingi qadam
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </button>

                                <div className="text-center mt-6">
                                    <span className="text-neutral-500 text-sm">Akkauntingiz bormi? </span>
                                    <Link href="/login/admin" className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors">
                                        Tizimga kirish
                                    </Link>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-fade-in text-white/90">
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-white">Tarifingizni tanlang</h2>
                                <p className="text-neutral-400">Biznesingiz ehtiyojiga qarab tarif tanlang (hozir bepul boshlaysiz)</p>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                {/* Starter Plan */}
                                <div
                                    onClick={() => setForm({ ...form, plan: 'starter' })}
                                    className={`cursor-pointer rounded-xl border p-5 transition-all ${form.plan === 'starter'
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-white">Starter</h3>
                                        <span className="text-sm font-medium px-2 py-1 rounded bg-neutral-800 text-neutral-300">100,000 / oy</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Yangi boshlovchilar uchun: 1 filial, 2 kassir</p>
                                </div>

                                {/* Business Plan */}
                                <div
                                    onClick={() => setForm({ ...form, plan: 'business' })}
                                    className={`relative cursor-pointer rounded-xl border p-5 transition-all ${form.plan === 'business'
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                                        }`}
                                >
                                    <div className="absolute -top-3 right-4 px-2 py-0.5 bg-blue-500 text-xs font-bold rounded text-white">
                                        MASHHUR
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-white">Business</h3>
                                        <span className="text-sm font-medium px-2 py-1 rounded bg-neutral-800 text-neutral-300">300,000 / oy</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Katta do'konlar uchun: 5 filial, 10 kassir</p>
                                </div>

                                {/* Premium Plan */}
                                <div
                                    onClick={() => setForm({ ...form, plan: 'premium' })}
                                    className={`cursor-pointer rounded-xl border p-5 transition-all ${form.plan === 'premium'
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-white">Premium</h3>
                                        <span className="text-sm font-medium px-2 py-1 rounded bg-neutral-800 text-neutral-300">Shartnoma asosida</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Yirik tarmoqlar uchun: Cheksiz</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-1/3 rounded-lg border border-neutral-700 bg-transparent p-3 font-medium text-white transition-all hover:bg-neutral-800"
                                >
                                    Orqaga
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="flex w-2/3 items-center justify-center rounded-lg bg-blue-600 p-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Kuting...
                                        </>
                                    ) : (
                                        "Ro'yxatdan o'tish"
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-center text-neutral-500 mt-6">
                                Ro'yxatdan o'tish orqali siz bizning barcha xizmat va maxfiylik shartlarimizga rozi bo'lasiz.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
