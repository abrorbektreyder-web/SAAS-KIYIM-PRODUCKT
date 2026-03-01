import { ShieldAlert, Phone, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getOrganization, getOrgProfile } from '@/lib/data';
import SignOutButton from './signout-button';

export default async function SubscriptionExpiredPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login/admin');
    }

    const profile = await getOrgProfile();
    let orgName = 'Tashkilot';

    if (profile?.organization_id) {
        const org = await getOrganization(profile.organization_id);
        if (org) {
            orgName = org.name;
            // Agar obuna faollashgan bo'lsa, dashboardga qaytaramiz
            if (org.subscription_status === 'active' || org.subscription_status === 'trialing' || org.subscription_status === 'trial') {
                if (profile.role === 'cashier') redirect('/store');
                else redirect('/dashboard');
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#121214] border border-neutral-800 rounded-3xl p-8 relative overflow-hidden">
                {/* Glow qismi xiralashtirilgan holda ko'rinib turadi */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-red-500/10 blur-[100px] pointer-events-none" />

                <div className="flex flex-col items-center text-center z-10 relative">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="text-2xl font-semibold text-white mb-2">
                        Obunangiz to'xtatildi
                    </h1>

                    <p className="text-neutral-400 text-sm mb-8">
                        {orgName} tashkiloti uchun tizimdan foydalanish muddati tugadi yoki administrator tomonidan bloklandi. Faoliyatni davom ettirish uchun obunani yangilang.
                    </p>

                    <div className="w-full space-y-4">
                        <button className="w-full relative group overflow-hidden rounded-xl border border-red-500/50 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-sm font-medium text-red-500 transition-colors flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            To'lov qilish (Tez orada)
                        </button>

                        <a href="tel:+998901234567" className="w-full rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Admin bilan bog'lanish
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <SignOutButton />
            </div>
        </div>
    );
}
