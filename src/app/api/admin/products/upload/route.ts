import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const orgId = formData.get('orgId') as string;

        if (!file || !orgId) {
            return NextResponse.json({ error: 'Fayl yoki OrgId topilmadi' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${orgId}/${Date.now()}_${fileName}`;

        const { data, error } = await supabaseAdmin.storage
            .from('products')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('products')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
