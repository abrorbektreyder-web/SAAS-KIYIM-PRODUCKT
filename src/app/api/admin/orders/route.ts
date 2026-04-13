import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = searchParams.get('orgId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = parseInt(searchParams.get('limit') || '500');

        if (!orgId) {
            return NextResponse.json({ error: 'Organization ID kutilmadi' }, { status: 400 });
        }

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
            // End date bo'lsa, kun oxirigacha olish uchun soatni qo'shamiz
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query = query.lte('created_at', end.toISOString());
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = searchParams.get('orgId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!orgId || !startDate || !endDate) {
            return NextResponse.json({ error: 'OrgId, boshlanish va tugash sanalari talab qilinadi' }, { status: 400 });
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
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}

