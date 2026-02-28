import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, full_name, phone } = body;

        if (!organization_id || !full_name || !phone) {
            return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('customers')
            .insert({
                organization_id,
                full_name,
                phone,
                tier: 'new',
                total_orders: 0,
                total_purchases: 0
            }).select().single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'Bu raqamli mijoz allaqachon mavjud' }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
