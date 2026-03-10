import { redirect } from 'next/navigation';

// Backward compatibility: eski /login/admin yo'lini yangi /admin ga yo'naltirish
export default function OldAdminLoginRedirect() {
    redirect('/admin');
}
