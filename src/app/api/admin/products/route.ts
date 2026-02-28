import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, name, price, sizes, colors } = body;

        if (!organization_id || !name) {
            return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert({
                organization_id,
                name,
                price: Number(price) || 0,
                sizes: sizes || [],
                colors: colors || [],
                is_active: true
            }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
