import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { organization_id, store_id, items, payment_method, total_amount } = body;

        if (!organization_id || !store_id || !items?.length) {
            return NextResponse.json({ error: "Noto'g'ri ma'lumotlar kiritildi" }, { status: 400 });
        }

        // To'lov usulini formatlaymiz (naqd => cash, karta => card)
        const mappedPaymentMethod = payment_method === 'naqd' ? 'cash' : (payment_method === 'karta' ? 'card' : 'cash');
        const order_number = `ORD-${Date.now()}`;

        // 1. Order yaratamiz
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                organization_id,
                store_id,
                order_number,
                total: total_amount,
                payment_method: mappedPaymentMethod,
                status: 'delivered'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Order items va Inventory ni yangilaymiz
        const orderItems = [];

        for (const item of items) {
            const product = item.product;
            const quantity = item.quantity;
            const price = product.price;

            orderItems.push({
                order_id: order.id,
                product_id: product.id,
                product_name_snapshot: product.name,
                product_price_snapshot: price,
                quantity,
                subtotal: quantity * price
            });

            // Ombordan ayirish (inventory ni update qilish)
            const { data: invData } = await supabaseAdmin
                .from('inventory')
                .select('stock, id')
                .eq('store_id', store_id)
                .eq('product_id', product.id)
                .single();

            if (invData) {
                const newStock = Math.max(0, invData.stock - quantity);
                await supabaseAdmin
                    .from('inventory')
                    .update({ stock: newStock })
                    .eq('id', invData.id);
            }
        }

        // 3. Order itemlarni qo'shish
        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return NextResponse.json({ success: true, order });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}
