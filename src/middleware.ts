import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // ===== PUBLIC SAHIFALAR =====
    // Bu sahifalar uchun autentifikatsiya kerak emas — to'g'ridan-to'g'ri o'tkazamiz
    const publicPaths = [
        '/',
        '/register',
        '/pos',
        '/admin',
        '/super',
        '/subscription-expired',
    ];

    const isPublicPath = publicPaths.some(p =>
        p === '/' ? path === '/' : path.startsWith(p) && (path === p || path.charAt(p.length) === '/')
    );

    // Eski /login yo'llarini yangilariga redirect qilish (backward compatibility)
    if (path === '/login' || path === '/login/') {
        return NextResponse.redirect(new URL('/pos', request.url))
    }
    if (path === '/login/admin' || path === '/login/admin/') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (path === '/login/super' || path === '/login/super/') {
        return NextResponse.redirect(new URL('/super', request.url))
    }

    // API va statik resurslarni o'tkazib yuborish
    if (
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path.startsWith('/favicon')
    ) {
        return NextResponse.next()
    }

    // Public sahifalarni o'tkazib yuborish
    if (isPublicPath) {
        return NextResponse.next()
    }

    // ===== HIMOYALANGAN SAHIFALAR =====
    // Bu yerdan pastda faqat /dashboard, /store, /super-admin kabi himoyalangan sahifalar

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // MUHIM: getUser() chaqirish tokenni yangilaydi
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Foydalanuvchi umuman kirmagan bo'lsa — mos login sahifasiga yo'naltirish
    if (!user) {
        if (path.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (path.startsWith('/store')) {
            return NextResponse.redirect(new URL('/pos', request.url))
        }
        if (path.startsWith('/super-admin')) {
            return NextResponse.redirect(new URL('/super', request.url))
        }
        // Boshqa barcha himoyalangan sahifalar uchun admin login
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // ===== ROL TEKSHIRISH =====
    let role: string | null = null;
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        role = profile?.role || null;
    } catch {
        role = null;
    }

    // Dashboard — faqat store_admin va super_admin
    if (path.startsWith('/dashboard') && role !== 'store_admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Store (POS/kassir sahifasi) — faqat cashier
    if (path.startsWith('/store') && role !== 'cashier') {
        return NextResponse.redirect(new URL('/pos', request.url))
    }

    // Super Admin panel — faqat super_admin
    if (path.startsWith('/super-admin') && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/super', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
