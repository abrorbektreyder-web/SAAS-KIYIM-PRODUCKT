import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const { data: orgs, error, count } = await supabaseAdmin
        .from('organizations')
        .select(`
            *,
            profiles!organizations_owner_id_fkey ( full_name, phone )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        // Fallback for foreign key if not set exactly
        const { data: orgsFallback, error: fallbackError } = await supabaseAdmin
            .from('organizations')
            .select(`*`)
            .order('created_at', { ascending: false });

        if (fallbackError) return NextResponse.json({ error: fallbackError.message }, { status: 400 });
        return NextResponse.json({ organizations: orgsFallback, count: orgsFallback?.length });
    }

    return NextResponse.json({ organizations: orgs, count });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, slug, email, plan, max_stores, max_cashiers } = body;

        // 1. Create a user for the organization owner
        const { data: userAuth, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: 'Password123!', // Ma'mur buni keyin o'zgartira oladi
            email_confirm: true,
            user_metadata: { role: 'store_admin', full_name: name + ' Egasi' }
        });

        if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

        // 2. Create organization
        const { data: org, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name,
                slug,
                owner_id: userAuth.user.id,
                plan,
                max_stores: Number(max_stores) || 1,
                max_cashiers: Number(max_cashiers) || 2,
                email,
                subscription_status: 'trial'
            }).select().single();

        if (orgError) return NextResponse.json({ error: orgError.message }, { status: 400 });

        // 3. Ensure profile is updated properly since handle_new_user trigger creates one automatically
        await supabaseAdmin.from('profiles').update({
            organization_id: org.id
        }).eq('id', userAuth.user.id);

        return NextResponse.json(org);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        const { data: org, error } = await supabaseAdmin
            .from('organizations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(org);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server xatosi' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID topilmadi' }, { status: 400 });

        const { error } = await supabaseAdmin
            .from('organizations')
            .delete()
            .eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
