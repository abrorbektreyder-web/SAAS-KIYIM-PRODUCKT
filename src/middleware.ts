import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // ===== 1. PUBLIC YO'LLAR =====
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

    // API va Statik resurslarni o'tkazib yuborish
    if (
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path.startsWith('/favicon') ||
        path.includes('.')
    ) {
        return NextResponse.next()
    }

    // Public sahifalar uchun autentifikatsiya shart emas
    if (isPublicPath) {
        return NextResponse.next()
    }

    // ===== 2. SUPABASE INITIALIZATION =====
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Foydalanuvchini olish (tokenni avtomatik yangilaydi)
    const { data: { user } } = await supabase.auth.getUser()

    // ===== 3. AUTENTIFIKATSIYA TEKSHIRUVI =====
    if (!user) {
        // Himoyalangan sahifadan (masalan /dashboard) mos login sahifasiga yo'naltirish
        if (path.startsWith('/dashboard')) return NextResponse.redirect(new URL('/admin', request.url))
        if (path.startsWith('/store')) return NextResponse.redirect(new URL('/pos', request.url))
        if (path.startsWith('/super-admin')) return NextResponse.redirect(new URL('/super', request.url))

        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // ===== 4. ROL ASOSIDA KIRISHNI CHEKLASH (RBAC) =====
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role || null;

    // Admin Dashboard (/dashboard) -> faqat store_admin yoki super_admin
    if (path.startsWith('/dashboard') && role !== 'store_admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // POS / Kassir sahifasi (/store) -> faqat cashier
    if (path.startsWith('/store') && role !== 'cashier') {
        return NextResponse.redirect(new URL('/pos', request.url))
    }

    // Platforma Super Admin (/super-admin) -> faqat super_admin
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
