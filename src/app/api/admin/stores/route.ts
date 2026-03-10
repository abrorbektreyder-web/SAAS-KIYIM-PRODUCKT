import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, name, address, city, phone, is_active } = body;

        if (!organization_id || !name) {
            return NextResponse.json({ error: 'Nomi va Tashkilot ID si kiritilishi majburiy!' }, { status: 400 });
        }

        // Qaysi tarifda ekanligini va qancha limit borligini tekshiramiz
        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .select('max_stores, plan')
            .eq('id', organization_id)
            .single();

        if (orgError || !orgData) {
            return NextResponse.json({ error: "Tashkilot ma'lumotlarini olishda xatolik yuz berdi" }, { status: 400 });
        }

        const { count, error: countError } = await supabaseAdmin
            .from('stores')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', organization_id);

        if (countError) {
            return NextResponse.json({ error: "Do'konlar sonini hisoblashda xatolik yuz berdi" }, { status: 400 });
        }

        if (count !== null && count >= orgData.max_stores) {
            return NextResponse.json({
                error: `Sizning tarifingiz (${orgData.plan}) bo'yicha do'konlar (filiallar) limiti cheklangan! Siz faqat ${orgData.max_stores} ta do'kon qo'sha olasiz. Cheklovni olib tashlash uchun barcha do'konlar uchun hamkorlik kelishuvini amalga oshiring.`
            }, { status: 403 });
        }

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .insert({
                organization_id,
                name,
                address,
                city,
                phone,
                is_active: is_active ?? true
            }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json(store);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, address, city, phone, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: "Filial ID ko'rsatilmagan!" }, { status: 400 });
        }

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .update({
                name,
                address,
                city,
                phone,
                is_active
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json(store);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Filial ID ko'rsatilmagan!" }, { status: 400 });
        }

        // Check if there are products or staff related to this store before deleting to prevent foreign key errors?
        // In Supabase, if we have foreign keys set to CASCADE, it will delete gracefully. 
        // If RESTRICT, it will error out. Let's try to delete directly.
        const { error } = await supabaseAdmin
            .from('stores')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
    }
}
