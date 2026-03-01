'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login/admin');
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-white transition-colors"
        >
            Boshqa akkaunt bilan kirish / Chiqish
        </button>
    );
}
