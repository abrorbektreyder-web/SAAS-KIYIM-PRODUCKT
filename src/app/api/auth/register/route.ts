import { NextResponse } from 'next/dist/server/web/spec-extension/response'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orgName, fullName, phone, email, password, plan } = body

        if (!orgName || !fullName || !phone || !email || !password || !plan) {
            return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 })
        }

        // 1. Yangi tashkilot egasini (store_admin) yaratish
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role: 'store_admin',
                phone: phone
            }
        })

        if (authError || !authData.user) {
            return NextResponse.json({ error: authError?.message || 'Foydalanuvchi yaratishda xatolik' }, { status: 400 })
        }

        const userId = authData.user.id

        // 2. Tashkilot (Organization) yaratish
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name: orgName,
                slug: slug,
                plan: plan,
                subscription_status: 'trial'
            })
            .select()
            .single()

        if (orgError || !orgData) {
            // Agar tashkilot yaratish oxshasa, userni ochirish kerak (rollback)
            await supabaseAdmin.auth.admin.deleteUser(userId)
            return NextResponse.json({ error: 'Tashkilot yaratishda xatokik: ' + orgError?.message }, { status: 400 })
        }

        // 3. Profilni yangilash (organization_id ni qo'shish)
        // Eslatma: auth.users triggeri avtomatik profil yaratib bo'lgan bo'lishi kerak.
        // Shuning uchun kutib turamiz va keyin update qilamiz:

        let profileUpdated = false;
        for (let i = 0; i < 3; i++) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    organization_id: orgData.id,
                    phone: phone
                })
                .eq('id', userId)

            if (!profileError) {
                profileUpdated = true;
                break;
            }
            await new Promise(r => setTimeout(r, 500)); // biroz kutish (trigger ishlashiga vaqt)
        }

        if (!profileUpdated) {
            return NextResponse.json({ error: 'Profilni yangilashda xatolik. Tizim administratori bilan boglaning.' }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Royxatdan muvaffaqiyatli otdingiz', userId: userId }, { status: 200 })

    } catch (error: any) {
        console.error('Register API Error:', error)
        return NextResponse.json({ error: 'Ichki server xatosi' }, { status: 500 })
    }
}
