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
        if (body.sizes !== undefined) updateData.sizes = body.sizes;
        if (body.colors !== undefined) updateData.colors = body.colors;
        if (body.image_url !== undefined) updateData.sku = body.image_url;
        if (body.category !== undefined || body.label !== undefined) {
            updateData.barcode = JSON.stringify({ category: body.category || 'Boshqa', label: body.label || '' });
        }

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

        // Xatolik bermasligi uchun avval ushbu mahsulot qatnashgan buyurtma qismlarini o'chiramiz 
        // (Test muhitida mahsulotni to'liq o'chirib yuborish uchun)
        await supabaseAdmin.from('order_items').delete().eq('product_id', id);

        // Inventoryni ham o'chirish
        await supabaseAdmin.from('inventory').delete().eq('product_id', id);

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete product err:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Delete product catch err:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
