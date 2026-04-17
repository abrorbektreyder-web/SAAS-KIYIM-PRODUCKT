import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

/**
 * Super Admin uchun umumiy platforma sozlamalarini boshqarish API
 */
export async function GET() {
    try {
        const { role, error } = await getSessionOrg();
        if (error || role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const { data, error: fetchError } = await supabaseAdmin
            .from('global_settings')
            .select('*');

        if (fetchError) throw fetchError;

        // Ma'lumotlarni key-value formatiga o'tkazish
        const settings = data.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { role, error } = await getSessionOrg();
        if (error || role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const body = await req.json();
        
        // Settings'larni upser qilish (bor bo'lsa yangilash, yo'q bo'lsa qo'shish)
        const updates = Object.entries(body).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
        }));

        const { error: upsertError } = await supabaseAdmin
            .from('global_settings')
            .upsert(updates, { onConflict: 'key' });

        if (upsertError) throw upsertError;

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
