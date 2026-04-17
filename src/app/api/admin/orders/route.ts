import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

export async function GET(req: Request) {
    try {
        const { orgId, error: authError } = await getSessionOrg();
        if (authError || !orgId) return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = parseInt(searchParams.get('limit') || '500');

        let query = supabaseAdmin
            .from('orders')
            .select('*, customers(full_name, phone)')
            .eq('organization_id', orgId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query = query.lte('created_at', end.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { orgId, role, error: authError } = await getSessionOrg();
        if (authError || !orgId) return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });

        if (role !== 'store_admin' && role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'Boshlanish va tugash sanalari talab qilinadi' }, { status: 400 });
        }

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const { error } = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('organization_id', orgId)
            .gte('created_at', startDate)
            .lte('created_at', end.toISOString());

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}


