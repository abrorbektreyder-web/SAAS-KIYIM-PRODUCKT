import { createClient } from './client'

export async function signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Profilni olish (rol aniqlash uchun)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, organization_id, store_id')
        .eq('id', data.user.id)
        .single()

    return { user: data.user, session: data.session, profile }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
}

export async function signUp(email: string, password: string, metadata: {
    full_name: string
    role: 'store_admin' | 'cashier'
    organization_name?: string
}) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
    })
    if (error) throw error
    return data
}
