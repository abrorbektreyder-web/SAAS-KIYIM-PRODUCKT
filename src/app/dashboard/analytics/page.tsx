import { getOrgProfile } from '@/lib/data';
import AnalyticsClient from './analytics-client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function AnalyticsPage() {
    const profile = await getOrgProfile();
    if (!profile?.organization_id) {
        return <div className="p-8 text-neutral-400">Tashkilot topilmadi.</div>;
    }

    // Kelajakda real ma'lumotlarni tortish uchun API ulanadi
    // Hozirda biz client qismida mock ma'lumotlar bilan chizyiz
    return (
        <AnalyticsClient orgId={profile.organization_id} />
    );
}
