import { getOrgProfile } from '@/lib/data';
import AnalyticsClient from './analytics-client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function AnalyticsPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    const orgId = profile.organization_id;

    // Barcha orderlarni olish
    const { data: ordersData } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('organization_id', orgId);

    const orders = ordersData || [];

    // Barcha mijozlarni olish
    const { data: customersData } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('organization_id', orgId);

    const customers = customersData || [];

    // Barcha order_items larni produkts va kategoriyalar bilan olish
    const { data: orderItemsData } = await supabaseAdmin
        .from('order_items')
        .select('*, orders!inner(organization_id), products(name, categories(name))')
        .eq('orders.organization_id', orgId);

    const orderItems = orderItemsData || [];

    // Oylarga bo'lish uchun joriy yilning oxirgi 6 oyini olamiz (yoki yil boshidan)
    // Soddaroq bo'lishi uchun Yanvardan Iyungacha (yoki hozirgi kungacha) qilish mumkin.
    // Keling, dinamik oxirgi 6 oyni topamiz.
    const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

    // Oylik sotuvlar (oxirgi 6 oy)
    const monthlyDataMap = new Map();
    const customerGrowthMap = new Map();

    // Oxirgi 6 oy strukturasi:
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
        const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
        const name = monthNames[m.getMonth()];
        const key = `${m.getFullYear()}-${m.getMonth()}`;
        monthlyDataMap.set(key, { name, sotuv: 0 });
        customerGrowthMap.set(key, { name, customers: 0, mKey: m.getTime() });
    }

    // 1. Oylik sotuvlar
    orders.forEach((o: any) => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthlyDataMap.has(key)) {
            monthlyDataMap.get(key).sotuv += o.total;
        }
    });

    // 2. Mijozlar o'sishi
    customers.forEach((c: any) => {
        const d = new Date(c.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (customerGrowthMap.has(key)) {
            customerGrowthMap.get(key).customers += 1;
        }
    });

    // Mijozlar kümülatif qo'shilishi (agar kerak bo'lsa) lekin biz faqat oylik o'sishni beramiz.
    let cumulativeCustomers = 0;
    const sortedCustomerKeys = Array.from(customerGrowthMap.values()).sort((a, b) => a.mKey - b.mKey);
    const customerGrowthData = sortedCustomerKeys.map(item => {
        cumulativeCustomers += item.customers;
        return { name: item.name, customers: cumulativeCustomers };
    });

    // 3. To'lov kanallari
    let cashCount = 0;
    let cardCount = 0;
    orders.forEach((o: any) => {
        if (o.payment_method === 'cash' || o.payment_method === 'naqd') cashCount++;
        else if (o.payment_method === 'card' || o.payment_method === 'karta') cardCount++;
    });
    const paymentData = [];
    if (cashCount > 0) paymentData.push({ name: 'Naqd', value: cashCount });
    if (cardCount > 0) paymentData.push({ name: 'Plastik', value: cardCount });
    if (paymentData.length === 0) paymentData.push({ name: 'Naqd', value: 1 }); // bo'sh bo'lmasligi uchun

    // 4. Turkumlar daromadi
    const categoryMap = new Map();
    const productSalesMap = new Map();

    orderItems.forEach((item: any) => {
        const catName = item.products?.categories?.name || 'Boshqa';
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + item.subtotal);

        const pName = item.product_name_snapshot || item.products?.name || 'Mahsulot';
        if (!productSalesMap.has(pName)) {
            productSalesMap.set(pName, {
                name: pName,
                sales: 0,
                price: item.product_price_snapshot
            });
        }
        productSalesMap.get(pName).sales += item.quantity;
    });

    const categoryData = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // top 5
    if (categoryData.length === 0) categoryData.push({ name: 'Boshqa', value: 1 });

    // 5. Top 5 mahsulotlar
    const topProducts = Array.from(productSalesMap.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    const initialData = {
        monthlyData: Array.from(monthlyDataMap.values()),
        customerGrowthData,
        paymentData,
        categoryData,
        topProducts
    };

    return (
        <AnalyticsClient
            orgId={orgId}
            initialData={initialData}
        />
    );
}
