import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

// Defolt sozlamalar — global_settings jadvali bo'lmasa ham ishlaydi
const DEFAULT_SETTINGS = {
    platform_name: 'HOYR',
    base_url: 'https://hoyr.uz',
    support_email: 'support@hoyr.uz',
    seo_description: 'HOYR B2B Platformasi',
};

export async function GET() {
    try {
        const { role, error } = await getSessionOrg();
        if (error || role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const { data, error: fetchError } = await supabaseAdmin
            .from('global_settings')
            .select('*');

        // Jadval mavjud bo'lmasa yoki boshqa xato — defolt qaytaramiz
        if (fetchError) {
            console.warn('global_settings table not found, returning defaults:', fetchError.message);
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        // Ma'lumotlarni key-value formatiga o'tkazish
        const settings = (data || []).reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, { ...DEFAULT_SETTINGS });

        return NextResponse.json(settings);
    } catch (e: any) {
        console.error('Settings GET error:', e.message);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function POST(req: Request) {
    try {
        const { role, error } = await getSessionOrg();
        if (error || role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const body = await req.json();

        const updates = Object.entries(body).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
        }));

        const { error: upsertError } = await supabaseAdmin
            .from('global_settings')
            .upsert(updates, { onConflict: 'key' });

        // Jadval yo'q bo'lsa xatolikni yashirmasdan, lekin 200 qaytaramiz
        if (upsertError) {
            console.warn('global_settings upsert error (table may not exist):', upsertError.message);
            return NextResponse.json({ success: true, warning: 'Settings not persisted — table missing' });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
