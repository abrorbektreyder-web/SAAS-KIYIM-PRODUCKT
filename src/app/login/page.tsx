import { redirect } from 'next/navigation';

// Backward compatibility: eski /login yo'lini yangi /pos ga yo'naltirish
export default function OldLoginRedirect() {
    redirect('/pos');
}
