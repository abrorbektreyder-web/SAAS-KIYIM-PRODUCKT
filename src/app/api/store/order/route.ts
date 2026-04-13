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
        }


        // 3. Order itemlarni qo'shish
        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // --- 4. TELEGRAM XABARNOMA ---
        // Async holatda ishlaydi (APIni kutib turmaydi)
        (async () => {
            try {
                // Do'kon va Kassir (profil) egasining tokenni aniqlash uchun tashkilot egasi kerak
                const { data: orgData } = await supabaseAdmin.from('organizations').select('owner_id').eq('id', organization_id).single();
                if (!orgData?.owner_id) return;

                const { data: userData } = await supabaseAdmin.auth.admin.getUserById(orgData.owner_id);
                const botToken = userData?.user?.user_metadata?.telegram_bot_token;
                const chatId = userData?.user?.user_metadata?.telegram_chat_id;

                if (botToken && chatId) {
                    const { data: storeData } = await supabaseAdmin.from('stores').select('name').eq('id', store_id).single();
                    const storeName = storeData?.name || 'Noma\'lum filial';

                    const productsText = items.map((i: any) => `${i.product.name} (${i.quantity})`).join(', ');

                    const messageText = `🛒 *YANGI SOTUV!*\n` +
                        `📍 Filial: *${storeName}*\n` +
                        `💰 Summa: *${total_amount.toLocaleString()} so'm*\n` +
                        `🧾 Buyurtma: *${order_number}*\n` +
                        `📦 Mahsulotlar: ${productsText}\n` +
                        `💳 To'lov: ${payment_method}`;

                    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: messageText,
                            parse_mode: 'Markdown'
                        })
                    }).catch(e => console.error("Telegram error:", e));
                }
            } catch (error) {
                console.error("Telegram notification error:", error);
            }
        })();

        return NextResponse.json({ success: true, order });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}
