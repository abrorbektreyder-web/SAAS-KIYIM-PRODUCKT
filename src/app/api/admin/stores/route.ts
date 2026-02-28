import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, name, address, city, phone, is_active } = body;

        if (!organization_id || !name) {
            return NextResponse.json({ error: 'Nomi va Tashkilot ID si kiritilishi majburiy!' }, { status: 400 });
        }

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .insert({
                organization_id,
                name,
                address,
                city,
                phone,
                is_active: is_active ?? true
            }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json(store);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
    }
}
