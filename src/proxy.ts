import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
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

    const path = request.nextUrl.pathname;

    // Login va API sahifalarini himoya qilmaslik
    if (
        path.startsWith('/login') ||
        path.startsWith('/api') ||
        path === '/' ||
        path.startsWith('/_next')
    ) {
        return supabaseResponse
    }

    // Foydalanuvchi umuman kimaganmi?
    if (!user) {
        if (path.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login/admin', request.url))
        }
        if (path.startsWith('/store')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (path.startsWith('/super-admin')) {
            return NextResponse.redirect(new URL('/login/super', request.url))
        }
        return supabaseResponse
    }

    // Foydalanuvchi bor, rolini tekshirish
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

    // Dashboard qismi — faqat store_admin va super_admin
    if (path.startsWith('/dashboard') && role !== 'store_admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/login/admin', request.url))
    }

    // Store (POS/kassir) qismi — faqat cashier
    if (path.startsWith('/store') && role !== 'cashier') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Super Admin qismi — faqat super_admin
    if (path.startsWith('/super-admin') && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/login/super', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
