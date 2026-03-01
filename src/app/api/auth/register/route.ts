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
                subscription_status: 'trialing'
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
        let lastError = null;
        for (let i = 0; i < 3; i++) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    organization_id: orgData.id,
                    full_name: fullName,
                    role: 'store_admin'
                })

            if (!profileError) {
                profileUpdated = true;
                break;
            }
            lastError = profileError;
            console.error('Profile update attempt error:', profileError);
            await new Promise(r => setTimeout(r, 500)); // biroz kutish (trigger ishlashiga vaqt)
        }

        if (!profileUpdated) {
            // Rollback if profile couldn't be updated (prevents incomplete state and 'already registered' error later)
            await supabaseAdmin.from('organizations').delete().eq('id', orgData.id);
            await supabaseAdmin.auth.admin.deleteUser(userId);

            return NextResponse.json({
                error: `Profilni yangilashda xatolik. Tizim administratori bilan boglaning. Data: ${lastError?.message || JSON.stringify(lastError)}`
            }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Royxatdan muvaffaqiyatli otdingiz', userId: userId }, { status: 200 })

    } catch (error: any) {
        console.error('Register API Error:', error)
        return NextResponse.json({ error: 'Ichki server xatosi' }, { status: 500 })
    }
}
