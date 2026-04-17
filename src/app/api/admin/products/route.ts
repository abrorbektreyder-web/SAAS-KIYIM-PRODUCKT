import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

export async function POST(req: Request) {
    try {
        // 1. Sessiya va Role tekshiruvi
        const { orgId, role, error } = await getSessionOrg();
        if (error || !orgId) return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
        
        // Faqat adminlar mahsulot qo'sha oladi
        if (role !== 'store_admin' && role !== 'super_admin') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const body = await req.json();
        const { name, price, sizes, colors, image_url, category, label, variants } = body;

        if (!name) {
            return NextResponse.json({ error: "Mahsulot nomi kiritilishi shart" }, { status: 400 });
        }

        // 2. Kategoriyani topamiz yoki yaratamiz
        let categoryId = null;
        if (category) {
            const { data: catData } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('organization_id', orgId)
                .eq('name', category)
                .maybeSingle();

            if (catData) {
                categoryId = catData.id;
            } else {
                const { data: newCat, error: newCatErr } = await supabaseAdmin
                    .from('categories')
                    .insert({ organization_id: orgId, name: category })
                    .select('id')
                    .single();
                if (!newCatErr) categoryId = newCat.id;
            }
        }

        let finalColors = colors || [];
        let finalSizes = sizes || [];
        if (variants && Array.isArray(variants) && variants.length > 0) {
            finalColors = [...new Set(variants.map((v: any) => v.color).filter(Boolean))];
            finalSizes  = [...new Set(variants.map((v: any) => v.size).filter(Boolean))];
        }

        // 3. Mahsulotni yaratamiz (qat'iy ravishda o'zining orgId si bilan)
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .insert({
                organization_id: orgId,
                name,
                price: Number(price) || 0,
                sizes: finalSizes,
                colors: finalColors,
                sku: image_url || null,
                category_id: categoryId,
                barcode: label || null,
                is_active: true
            })
            .select()
            .single();

        if (productError) return NextResponse.json({ error: productError.message }, { status: 400 });

        // 4. Variantlar
        if (variants && Array.isArray(variants) && variants.length > 0 && product) {
            const variantRows = variants.map((v: any) => ({
                product_id: product.id,
                color: (v.color || '').trim(),
                size:  (v.size  || '').trim(),
                stock: Number(v.stock) || 0,
            }));

            await supabaseAdmin.from('product_variants').insert(variantRows);
        }

        // 5. Filiallarga inventory yozuvini qo'shish
        const { data: stores } = await supabaseAdmin
            .from('stores')
            .select('id')
            .eq('organization_id', orgId);

        if (stores && stores.length > 0 && product) {
            const totalStock = variants && Array.isArray(variants)
                ? variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0)
                : 0;

            const inventoryRows = stores.map((store: any) => ({
                store_id: store.id,
                product_id: product.id,
                stock: totalStock || 0
            }));

            await supabaseAdmin.from('inventory').upsert(inventoryRows, {
                onConflict: 'store_id,product_id'
            });
        }

        return NextResponse.json(product);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

