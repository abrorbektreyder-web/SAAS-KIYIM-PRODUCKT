import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
        return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // `profiles` orqali shu tashkilotga tegishli admin yoki kassirlarni olamiz
    const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select(`
            id,
            full_name,
            phone,
            role,
            store_id,
            stores ( name )
        `)
        .eq('organization_id', orgId)
        .eq('role', 'cashier')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(profiles);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, full_name, role, organization_id, store_id } = body;

        if (!email || !password || !full_name || !organization_id) {
            return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
        }

        // 1. Supabase Auth da yaratamiz
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name,
                role: role || 'cashier',
            }
        });

        if (authError) {
            let errorMsg = authError.message;
            if (errorMsg.includes('already been registered')) {
                errorMsg = "Bu email (pochta) bilan allaqachon ro'yxatdan o'tilgan. Kassir uchun mutlaqo yangi va boshqa email nomini kiriting!";
            }
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        const userId = authData.user.id;

        // 2. Profilni upsert qilamiz (trigger ishlamasa ham ishlaydi)
        // Retrylar bilan — trigger profil yaratishni kechiktirishi mumkin
        let profileSaved = false;
        for (let attempt = 0; attempt < 3; attempt++) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name,
                    role: role || 'cashier',
                    organization_id,
                    store_id: store_id || null,
                    is_active: true,
                });

            if (!profileError) {
                profileSaved = true;
                break;
            }

            // Biroz kutib qaytadan urinish
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!profileSaved) {
            // Agar profil saqlanmasa, userni o'chiramiz
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return NextResponse.json({ error: 'Kassir profilini saqlashda xatolik yuz berdi. Qaytadan urinib koring.' }, { status: 400 });
        }

        return NextResponse.json({ success: true, user: authData.user });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Foydalanuvchi ID kiritilmadi" }, { status: 400 });
        }

        // Delete user (also cascade deletes profile)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
