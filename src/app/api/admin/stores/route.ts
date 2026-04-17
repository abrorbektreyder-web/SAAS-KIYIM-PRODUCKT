import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

export async function POST(req: Request) {
    try {
        const { orgId, role, error: authError } = await getSessionOrg();
        if (authError || !orgId) return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });

        if (role !== 'store_admin' && role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const body = await req.json();
        const { name, address, city, phone, is_active } = body;

        if (!name) return NextResponse.json({ error: 'Nomi kiritilishi majburiy!' }, { status: 400 });

        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .select('max_stores, plan')
            .eq('id', orgId)
            .single();

        if (orgError || !orgData) return NextResponse.json({ error: "Tashkilot ma'lumotlari topilmadi" }, { status: 400 });

        const { count, error: countError } = await supabaseAdmin
            .from('stores')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', orgId);

        if (countError) return NextResponse.json({ error: "Hisof-kitobda xatolik" }, { status: 400 });

        if (count !== null && count >= orgData.max_stores) {
            return NextResponse.json({ error: `Tarif limiti: ${orgData.max_stores}` }, { status: 403 });
        }

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .insert({
                organization_id: orgId,
                name,
                address,
                city,
                phone,
                is_active: is_active ?? true
            }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(store);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { orgId, error: authError } = await getSessionOrg();
        if (authError || !orgId) return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, name, address, city, phone, is_active } = body;

        if (!id) return NextResponse.json({ error: "ID ko'rsatilmagan" }, { status: 400 });

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .update({ name, address, city, phone, is_active })
            .eq('id', id)
            .eq('organization_id', orgId)
            .select()
            .single();

        if (error || !store) return NextResponse.json({ error: "Do'kon topilmadi yoki sizga tegishli emas" }, { status: 404 });
        return NextResponse.json(store);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { orgId, error: authError } = await getSessionOrg();
        if (authError || !orgId) return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID ko'rsatilmagan" }, { status: 400 });

        const { error } = await supabaseAdmin
            .from('stores')
            .delete()
            .eq('id', id)
            .eq('organization_id', orgId);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

