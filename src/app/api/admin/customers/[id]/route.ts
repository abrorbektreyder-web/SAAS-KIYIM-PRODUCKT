import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const { data, error } = await supabaseAdmin
            .from('customers')
            .update({
                full_name: body.full_name,
                phone: body.phone,
                tier: body.tier,
                notes: body.notes
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Note: In a real system, we might want to prevent deleting customers who have orders.
        // But for this SaaS, we'll allow it (cascade should be handled by DB or manually)
        // Let's check for orders first if we want to be safe, but user asked for simple delete.
        
        const { error } = await supabaseAdmin
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
