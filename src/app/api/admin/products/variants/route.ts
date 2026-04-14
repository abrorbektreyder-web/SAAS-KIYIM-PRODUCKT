import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET /api/admin/products/variants?productId=xxx
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'productId kerak' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('product_variants')
            .select('*')
            .eq('product_id', productId)
            .order('color')
            .order('size');

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data || []);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/admin/products/variants — Bulk upsert (mahsulot yaratilganda)
// Body: { productId: string, variants: { color: string, size: string, stock: number }[] }
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, variants } = body;

        if (!productId || !Array.isArray(variants)) {
            return NextResponse.json({ error: "productId va variants kerak" }, { status: 400 });
        }

        if (variants.length === 0) {
            return NextResponse.json({ data: [] });
        }

        const rows = variants.map((v: { color: string; size: string; stock: number }) => ({
            product_id: productId,
            color: v.color.trim(),
            size: v.size.trim(),
            stock: Number(v.stock) || 0,
        }));

        const { data, error } = await supabaseAdmin
            .from('product_variants')
            .upsert(rows, { onConflict: 'product_id,color,size', ignoreDuplicates: false })
            .select();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PATCH /api/admin/products/variants — Update a single variant stock
// Body: { id: string, stock: number }
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, stock, productId, color, size } = body;

        if (id) {
            // Update by ID
            const { data, error } = await supabaseAdmin
                .from('product_variants')
                .update({ stock: Number(stock) || 0 })
                .eq('id', id)
                .select()
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 400 });
            return NextResponse.json(data);
        } else if (productId && color !== undefined && size !== undefined) {
            // Upsert by composite key
            const { data, error } = await supabaseAdmin
                .from('product_variants')
                .upsert({
                    product_id: productId,
                    color: color.trim(),
                    size: size.trim(),
                    stock: Number(stock) || 0
                }, { onConflict: 'product_id,color,size' })
                .select()
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 400 });
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ error: "id yoki (productId + color + size) kerak" }, { status: 400 });
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE /api/admin/products/variants?productId=xxx — Delete all variants for a product
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const variantId = searchParams.get('id');

        if (variantId) {
            await supabaseAdmin.from('product_variants').delete().eq('id', variantId);
        } else if (productId) {
            await supabaseAdmin.from('product_variants').delete().eq('product_id', productId);
        } else {
            return NextResponse.json({ error: 'id yoki productId kerak' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
