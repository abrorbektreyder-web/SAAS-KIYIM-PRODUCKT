import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// DELETE /api/admin/inventory/cleanup?fromDate=xxx&toDate=xxx&limit=xxx
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const limitParam = searchParams.get('limit');

        if (!fromDate || !toDate) {
            return NextResponse.json({ error: "Sanalarni to'liq kiritish majburiy!" }, { status: 400 });
        }

        // Tungi soat gacha bo'lishi uchun toDate ga 23:59:59 qo'shamiz
        const start = new Date(fromDate).toISOString();
        const end = new Date(toDate + 'T23:59:59Z').toISOString();

        // Step 1: Find variants that match the criteria
        let query = supabaseAdmin
            .from('product_variants')
            .select('id')
            .gte('created_at', start)
            .lte('created_at', end)
            .order('created_at', { ascending: true }); // older first

        if (limitParam && limitParam !== 'all') {
            const limit = parseInt(limitParam, 10);
            if (!isNaN(limit) && limit > 0) {
                query = query.limit(limit);
            }
        }

        const { data: variantsToDelete, error: fetchError } = await query;

        if (fetchError) {
            return NextResponse.json({ 
                error: "Dastlabki ma'lumotlarni o'qishda xatolik yuz berdi. Balki jadvalda sana ustuniga kirish huquqi yo'qdir.", 
                details: fetchError 
            }, { status: 400 });
        }

        if (!variantsToDelete || variantsToDelete.length === 0) {
            return NextResponse.json({ message: "O'chirish uchun ma'lumot topilmadi", count: 0 });
        }

        const ids = variantsToDelete.map(v => v.id);

        // Step 2: Delete those specific variants
        const { error: deleteError } = await supabaseAdmin
            .from('product_variants')
            .delete()
            .in('id', ids);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Muvaffaqiyatli tozalandi",
            deletedCount: ids.length
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
