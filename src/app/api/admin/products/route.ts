import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { organization_id, name, price, sizes, colors, image_url, category, label, variants } = body;

        // Agar 'auto' yuborilsa — logindan organization_id ni topamiz
        if (organization_id === 'auto') {
            const supabase = await createServerSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return NextResponse.json({ error: 'Avtorizatsiya kerak' }, { status: 401 });

            const { data: profile } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return NextResponse.json({ error: 'Tashkilot topilmadi' }, { status: 400 });
            organization_id = profile.organization_id;
        }

        if (!organization_id || !name) {
            return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
        }

        // 1. Kategoriyani topamiz yoki yaratamiz
        let categoryId = null;
        if (category) {
            const { data: catData } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('organization_id', organization_id)
                .eq('name', category)
                .maybeSingle();

            if (catData) {
                categoryId = catData.id;
            } else {
                const { data: newCat, error: newCatErr } = await supabaseAdmin
                    .from('categories')
                    .insert({ organization_id, name: category })
                    .select('id')
                    .single();
                if (!newCatErr) categoryId = newCat.id;
            }
        }

        // colors & sizes — variant bo'lsa, undan extract qilamiz
        let finalColors = colors || [];
        let finalSizes = sizes || [];
        if (variants && Array.isArray(variants) && variants.length > 0) {
            finalColors = [...new Set(variants.map((v: any) => v.color).filter(Boolean))];
            finalSizes  = [...new Set(variants.map((v: any) => v.size).filter(Boolean))];
        }

        // 2. Mahsulotni yaratamiz
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .insert({
                organization_id,
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

        // 3. Variant Inventory — product_variants jadvaliga saqlash
        if (variants && Array.isArray(variants) && variants.length > 0 && product) {
            const variantRows = variants.map((v: any) => ({
                product_id: product.id,
                color: (v.color || '').trim(),
                size:  (v.size  || '').trim(),
                stock: Number(v.stock) || 0,
            }));

            const { error: variantError } = await supabaseAdmin
                .from('product_variants')
                .insert(variantRows);

            if (variantError) {
                console.error('Variant save error:', variantError.message);
                // Mahsulot yaratildi lekin variant saqlanmadi — log qilamiz, xato qaytarmaymiz
            }
        }

        // 4. Barcha filiallarga inventory yozuvini qo'shamiz (boshlang'ich soni)
        const { data: stores } = await supabaseAdmin
            .from('stores')
            .select('id')
            .eq('organization_id', organization_id);

        if (stores && stores.length > 0 && product) {
            // Umumiy stock — variantlar yig'indisi
            const totalStock = variants && Array.isArray(variants)
                ? variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0)
                : 0;

            const inventoryRows = stores.map((store: any) => ({
                store_id: store.id,
                product_id: product.id,
                stock: totalStock || 0
            }));

            await supabaseAdmin.from('inventory').upsert(inventoryRows, {
                onConflict: 'store_id,product_id',
                ignoreDuplicates: false
            });
        }

        return NextResponse.json(product);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
