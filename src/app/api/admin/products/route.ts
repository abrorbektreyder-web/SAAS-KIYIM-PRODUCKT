import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { organization_id, name, price, sizes, colors, image_url, category, label } = body;

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
            return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 });
        }

        // 1. Kategoriyani topamiz yoki yaratamiz
        let categoryId = null;
        if (category) {
            const { data: catData, error: catError } = await supabaseAdmin
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

        // 2. Mahsulotni yaratamiz (Mavjud ustunlarga: image_url -> sku, label -> barcode)
        const { data, error } = await supabaseAdmin
            .from('products')
            .insert({
                organization_id,
                name,
                price: Number(price) || 0,
                sizes: sizes || [],
                colors: colors || [],
                sku: image_url || null,
                category_id: categoryId,
                barcode: label || null,
                is_active: true
            }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        // 2. Barcha filiallarga inventory yozuvini qo'shamiz (boshlang'ich 0 dona)
        const { data: stores } = await supabaseAdmin
            .from('stores')
            .select('id')
            .eq('organization_id', organization_id);

        if (stores && stores.length > 0 && data) {
            const inventoryRows = stores.map((store: any) => ({
                store_id: store.id,
                product_id: data.id,
                stock: 10 // Boshlang'ich miqdor: 10 dona
            }));

            await supabaseAdmin
                .from('inventory')
                .insert(inventoryRows);
        }

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
