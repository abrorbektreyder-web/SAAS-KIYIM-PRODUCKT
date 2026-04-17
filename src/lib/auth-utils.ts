import { createServerSupabaseClient } from './supabase/server';

/**
 * Server-side API'lar uchun foydalanuvchi sessiyasi va tashkilot ID sini olib beradi.
 * Xavfsizlikni ta'minlash uchun har doim ushbu funksiyadan foydalanish tavsiya etiladi.
 */
export async function getSessionOrg() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { user: null, orgId: null, role: null, error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', user.id)
        .single();

    if (!profile || !profile.organization_id) {
        return { user, orgId: null, role: null, error: 'No organization found' };
    }

    return { 
        user, 
        orgId: profile.organization_id, 
        role: profile.role, 
        error: null 
    };
}
