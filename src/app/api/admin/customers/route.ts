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
        const { full_name, phone } = body;

        if (!full_name || !phone) {
            return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('customers')
            .insert({
                organization_id: orgId,
                full_name,
                phone,
                tier: 'new',
                total_orders: 0,
                total_purchases: 0
            }).select().single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Bu raqamli mijoz allaqachon mavjud' }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

