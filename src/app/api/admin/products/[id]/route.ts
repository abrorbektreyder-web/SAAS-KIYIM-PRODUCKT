import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.price !== undefined) updateData.price = Number(body.price);
        if (body.name !== undefined) updateData.name = body.name;
        if (body.is_active !== undefined) updateData.is_active = body.is_active;

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(updateData)
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

        // Inventoryni ham o'chirish
        await supabaseAdmin.from('inventory').delete().eq('product_id', id);

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
