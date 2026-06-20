import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSessionOrg } from '@/lib/auth-utils';

const BUCKET = 'product-images';
const MAX_SIZE_MB = 5;

export async function POST(req: Request) {
    try {
        // Auth tekshiruv
        const { orgId, role, error: authError } = await getSessionOrg();
        if (authError || !orgId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (role !== 'store_admin' && role !== 'super_admin' && role !== 'cashier') {
            return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
        }

        // Fayl hajmini tekshirish (max 5MB)
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json({ error: `Rasm hajmi ${MAX_SIZE_MB}MB dan oshmasligi kerak` }, { status: 400 });
        }

        // Faqat rasm formatlarini qabul qilamiz
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Faqat JPG, PNG, WEBP, GIF formatlar qabul qilinadi' }, { status: 400 });
        }

        // Unikal fayl nomi: orgId/timestamp-randomHash.ext
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${orgId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Supabase Storage ga yuklash
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Ommaviy URL olish
        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET)
            .getPublicUrl(data.path);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (e: any) {
        console.error('Image upload error:', e);
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}
