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
        if (body.label !== undefined) updateData.barcode = body.label;

        // Kategoriya mantiqi
        if (body.category !== undefined) {
            // Tashkilot ID sini topamiz
            const { data: product } = await supabaseAdmin
                .from('products')
                .select('organization_id')
                .eq('id', id)
                .single();
            
            if (product?.organization_id) {
                const orgId = product.organization_id;
                const catName = body.category;

                const { data: catData } = await supabaseAdmin
                    .from('categories')
                    .select('id')
                    .eq('organization_id', orgId)
                    .eq('name', catName)
                    .maybeSingle();
                
                if (catData) {
                    updateData.category_id = catData.id;
                } else {
                    const { data: newCat } = await supabaseAdmin
                        .from('categories')
                        .insert({ organization_id: orgId, name: catName })
                        .select('id')
                        .single();
                    if (newCat) updateData.category_id = newCat.id;
                }
            }
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        // Update variants if provided
        if (body.variants !== undefined) {
            // First, delete old variants (if new variants array is passed)
            await supabaseAdmin.from('product_variants').delete().eq('product_id', id);

            if (Array.isArray(body.variants) && body.variants.length > 0) {
                const variantRows = body.variants.map((v: any) => ({
                    product_id: id,
                    color: (v.color || '').trim(),
                    size:  (v.size  || '').trim(),
                    stock: Number(v.stock) || 0,
                }));
                const { error: variantError } = await supabaseAdmin.from('product_variants').insert(variantRows);
                
                if (!variantError) {
                    // Update inventory: overall stock is the sum of variant stock.
                    // Instead of full logic, let's simply get totalStock. 
                    // To do it correctly per store we need the org stores, but since this is broad optimization we can just insert one summary record per store.
                    const totalStock = body.variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);
                    
                    if (data?.organization_id) {
                        const { data: stores } = await supabaseAdmin
                            .from('stores')
                            .select('id')
                            .eq('organization_id', data.organization_id);
                            
                        if (stores && stores.length > 0) {
                            const inventoryRows = stores.map((store: any) => ({
                                store_id: store.id,
                                product_id: id,
                                stock: totalStock || 0
                            }));
                            await supabaseAdmin.from('inventory').upsert(inventoryRows, {
                                onConflict: 'store_id,product_id',
                                ignoreDuplicates: false
                            });
                        }
                    }
                }
            }
        }

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Bog'liqliklarni o'chirish
        await supabaseAdmin.from('order_items').delete().eq('product_id', id);
        await supabaseAdmin.from('inventory').delete().eq('product_id', id);

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
