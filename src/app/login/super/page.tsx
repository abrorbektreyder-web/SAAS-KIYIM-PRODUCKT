import { redirect } from 'next/navigation';

// Backward compatibility: eski /login/super yo'lini yangi /super ga yo'naltirish
export default function OldSuperLoginRedirect() {
    redirect('/super');
}
