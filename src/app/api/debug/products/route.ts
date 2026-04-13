import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('id, name, sku, barcode')
            .limit(20);
        
        if (error) throw error;
        return NextResponse.json({ products: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
