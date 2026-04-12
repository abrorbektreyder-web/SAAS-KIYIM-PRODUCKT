import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, Package, ShieldCheck, Smartphone, Users, TrendingUp } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-emerald-500/30">
            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#D4A843] to-[#E8C66A] text-transparent bg-clip-text">
                            HOYR
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
                        <a href="#features" className="hover:text-white transition-colors">Qulayliklar</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Tariflar</a>
                        <Link href="/login" className="hover:text-white transition-colors">Tizimga kirish</Link>
                    </nav>
                    <div className="flex items-center">
                        <Link 
                            href="/register" 
                            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                        >
                            <span className="mr-2">Boshlash</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        HOYR SaaS - Tizim yangilandi
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
                        Kiyim do'koningizni <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                            avtomatlashtiring
                        </span>
                    </h1>
                    
                    <p className="max-w-2xl text-lg md:text-xl text-neutral-400 mb-10 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
                        Savdoni oshiring, omborni aniq boshqaring va xodimlar ishini nazorat qiling. Barchasi bitta professional dasturda.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
                        <Link 
                            href="/register" 
                            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-semibold text-black transition-all hover:scale-105"
                        >
                            <span>Bepul sinab ko'rish</span>
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-20 w-full rounded-2xl border border-white/10 bg-[#121214] overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-fade-in relative group" style={{ animationDelay: '0.5s', opacity: 0 }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 z-20">
                            <Link href="/register" className="text-white font-medium border border-emerald-500/50 bg-emerald-500/20 px-8 py-4 rounded-full backdrop-blur-md hover:bg-emerald-500/30 transition-colors flex items-center">
                                To'liq versiyani ko'rish <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                        
                        {/* Fake Mac Window Header */}
                        <div className="h-12 border-b border-white/5 bg-[#18181b] flex items-center px-4 gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <div className="mx-auto bg-white/5 rounded-md px-32 py-1 flex items-center border border-white/5">
                                <span className="text-xs text-neutral-500">app.hoyr.uz/dashboard</span>
                            </div>
                        </div>

                        {/* App UI */}
                        <div className="h-[450px] flex bg-[#0c0c0e]">
                            {/* Sidebar */}
                            <div className="w-64 hidden md:flex flex-col border-r border-white/5 bg-[#09090b] p-4 font-inter text-left">
                                <div className="flex items-center gap-3 mb-8 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                                        <span className="font-bold text-white text-lg">B</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Baraka Do'koni</h4>
                                        <p className="text-[10px] text-emerald-500">Premium ta'rif</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_2px_0_0_#10b981]">
                                        <BarChart3 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Bosh panel</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                        <Smartphone className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sotuv bo'limi</span>
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-4 h-4" />
                                            <span className="text-sm font-medium">Ombor</span>
                                        </div>
                                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">Kam</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">Xodimlar</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sozlamalar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-6 flex flex-col items-start text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                                
                                <div className="flex justify-between items-center w-full mb-6 z-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Xush kelibsiz, Sardor</h3>
                                        <p className="text-sm text-neutral-400">Bugungi savdolar xulosasi (12 Aprel, 2026)</p>
                                    </div>
                                    <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-lg p-1">
                                        <div className="px-4 py-1.5 bg-white/10 rounded-md text-sm font-medium shadow-sm">Bugun</div>
                                        <div className="px-4 py-1.5 text-neutral-400 text-sm font-medium hover:text-white cursor-pointer transition-colors">Hafta</div>
                                    </div>
                                </div>

                                {/* KPIs */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6 z-10">
                                    {/* Card 1 */}
                                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <span className="text-sm text-neutral-400 font-medium">Kunlik Tushum</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white tracking-tight">12,450,000 <span className="text-lg text-neutral-500 font-normal">UZS</span></div>
                                        <div className="mt-2 text-xs flex items-center text-emerald-400">
                                            <TrendingUp className="w-3 h-3 mr-1" /> +14.5% kechagidan
                                        </div>
                                    </div>
                                    
                                    {/* Card 2 */}
                                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full" />
                                        <div className="flex items-center gap-3 mb-3 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm text-neutral-400 font-medium">Sotilgan tovarlar</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white tracking-tight relative z-10">142 <span className="text-lg text-neutral-500 font-normal">dona</span></div>
                                        <div className="mt-2 text-xs flex items-center text-emerald-400 relative z-10">
                                            <TrendingUp className="w-3 h-3 mr-1" /> +8% o'sish
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 hover:border-white/20 transition-colors hidden sm:block">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm text-neutral-400 font-medium">Mijozlar</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white tracking-tight">48 <span className="text-lg text-neutral-500 font-normal">yangi</span></div>
                                        <div className="mt-2 text-xs flex items-center text-emerald-400">
                                            <TrendingUp className="w-3 h-3 mr-1" /> Reyting 4.9/5
                                        </div>
                                    </div>
                                </div>

                                {/* Active Orders List */}
                                <div className="flex-1 w-full rounded-xl bg-white/[0.02] border border-white/5 flex flex-col overflow-hidden z-10">
                                    <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                        <h4 className="font-semibold text-white">So'nggi savdolar</h4>
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Real vaqt</span>
                                    </div>
                                    <div className="flex-1 p-2">
                                        {[
                                            { id: "#B-1042", time: "1soat oldin", item: "Kuzgi palto - Qora (M)", amount: "450,000 UZS", type: "Terminal", status: "To'langan" },
                                            { id: "#B-1041", time: "2soat oldin", item: "Oq ko'ylak (L) + Jinsi", amount: "620,000 UZS", type: "Naqd", status: "To'langan" },
                                            { id: "#B-1040", time: "Bugun 11:30", item: "Krossovka Nike (42)", amount: "890,000 UZS", type: "Terminal", status: "To'langan" }
                                        ].map((order, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/[0.02] last:border-0 group cursor-default">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{order.item}</div>
                                                        <div className="text-xs text-neutral-500 flex items-center gap-2">
                                                            <span className="font-mono">{order.id}</span>
                                                            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                                                            {order.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-white">{order.amount}</div>
                                                    <div className="text-xs text-neutral-500 flex items-center justify-end gap-1 mt-0.5">
                                                        {order.type} • <span className="text-emerald-400">{order.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-[#0c0c0e] relative border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Nega aynan HOYR?</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Sizning biznesingizni yanada oson va daromadli qiluvchi maxsus imkoniyatlar.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Package, title: "Ombor hisobi", desc: "Har bir tovarning rangi, o'lchami va shtrix-kodi orqali aniq tizimlashtirilgan baza." },
                            { icon: Smartphone, title: "Kassir paneli", desc: "Shtrix-kod skaneri va oson savat orqali tezkor to'lovlarni qabul qilish." },
                            { icon: BarChart3, title: "Chuqur Analitika", desc: "Daromad, xarajat va eng ko'p sotilgan mahsulotlarni grafik tarzida ko'rish." },
                            { icon: Users, title: "Xodimlar nazorati", desc: "Kassirlar ishlagan vaqtini, qancha pul sotganini nazorat oling." },
                            { icon: ShieldCheck, title: "To'liq Xavfsizlik", desc: "Ma'lumotlaringiz ishonchli himoyalangan va faqat o'zingiz ko'ra olasiz." },
                            { icon: CheckCircle2, title: "Multi-Filial tizimi", desc: "10 ta do'koningiz bo'lsa ham ularning barchasini 1 ta joydan boshqaring." }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 relative">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Moslashuvchan tariflar</h2>
                        <p className="text-neutral-400">Biznesingiz hajmiga qarab tanlang. Barcha tariflarda dastlabki 14 kun bepul!</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Starter */}
                        <div className="rounded-3xl border border-white/10 bg-[#121214] p-8 flex flex-col hover:border-white/20 transition-colors">
                            <h3 className="text-xl font-medium text-neutral-300">Starter</h3>
                            <div className="mt-4 mb-8 flex items-baseline">
                                <span className="text-4xl font-bold">150,000</span>
                                <span className="text-neutral-500 ml-2">so'm/oy</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> 1 ta filial</li>
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> 2 ta kassir</li>
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Asosiy reyting</li>
                            </ul>
                            <Link href="/register" className="w-full h-12 rounded-full border border-white/10 flex items-center justify-center font-medium hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
                                Tanlash
                            </Link>
                        </div>
                        {/* Business */}
                        <div className="rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-500/10 to-[#121214] p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Eng ommabop
                            </div>
                            <h3 className="text-xl font-medium text-white">Business</h3>
                            <div className="mt-4 mb-8 flex items-baseline">
                                <span className="text-4xl font-bold">350,000</span>
                                <span className="text-neutral-500 ml-2">so'm/oy</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-sm text-white"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> 5 ta filialgacha</li>
                                <li className="flex items-center text-sm text-white"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> 10 ta kassirgacha</li>
                                <li className="flex items-center text-sm text-white"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Kengaytirilgan analitika</li>
                                <li className="flex items-center text-sm text-white"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Mijozlar bazasi</li>
                            </ul>
                            <Link href="/register" className="w-full h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold hover:bg-emerald-400 hover:shadow-lg transition-colors">
                                Boshlash
                            </Link>
                        </div>
                        {/* Premium */}
                        <div className="rounded-3xl border border-white/10 bg-[#121214] p-8 flex flex-col hover:border-white/20 transition-colors">
                            <h3 className="text-xl font-medium text-neutral-300">Premium</h3>
                            <div className="mt-4 mb-8 flex items-baseline">
                                <span className="text-4xl font-bold">Maxsus</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Cheksiz filiallar</li>
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Cheksiz xodimlar</li>
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Shaxsiy menejer</li>
                                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" /> Sotuv tahlil markazi</li>
                            </ul>
                            <Link href="/register" className="w-full h-12 rounded-full border border-white/10 flex items-center justify-center font-medium hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
                                Bog'lanish
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call To Action Footer */}
            <footer className="border-t border-white/10 bg-[#060608] pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Tayyormisiz?</h2>
                    <p className="text-xl text-neutral-400 mb-10">Biznesingizni samarali va zamonaviy usulda boshqarishni bugundanoq boshlang.</p>
                    <Link 
                        href="/register" 
                        className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-bold text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        Ro'yxatdan o'tish
                    </Link>
                </div>
                
                <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                         <span className="font-bold text-neutral-300">HOYR SaaS</span>
                         <span>© 2026. Barcha huquqlar himoyalangan.</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
                        <a href="#" className="hover:text-white transition-colors">Telegram yordam</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
