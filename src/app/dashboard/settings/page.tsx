'use client';

import { useState, useEffect } from 'react';
import { Save, Send, ShieldAlert, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [userId, setUserId] = useState('');
    const [form, setForm] = useState({
        telegram_bot_token: '',
        telegram_chat_id: ''
    });

    useEffect(() => {
        async function fetchSettings() {
            setFetching(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                if (user.user_metadata) {
                    setForm({
                        telegram_bot_token: user.user_metadata.telegram_bot_token || '',
                        telegram_chat_id: user.user_metadata.telegram_chat_id || ''
                    });
                }
            }
            setFetching(false);
        }
        fetchSettings();
    }, [supabase.auth]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            setMessage({ type: 'error', text: 'Avtorizatsiya xatosi (user topilmadi)' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin/settings/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, userId })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');

            setMessage({ type: 'success', text: 'Sozlamalar muvaffaqiyatli saqlandi!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleTestMessage = async () => {
        if (!form.telegram_bot_token || !form.telegram_chat_id) {
            setMessage({ type: 'error', text: 'Avval token va chat IDni saqlang!' });
            return;
        }

        try {
            const res = await fetch('/api/admin/settings/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    test_mode: true,
                    telegram_bot_token: form.telegram_bot_token,
                    telegram_chat_id: form.telegram_chat_id
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Test xabar yuborildi! Telegramni tekshiring.' });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: 'Telegram bot xato! ' + (data.error || 'Token yoki Chat ID noto\'g\'ri') });
            }
        } catch (e: any) {
            setMessage({ type: 'error', text: 'Tarmoq xatosi: ' + e.message });
        }
    };

    if (fetching) {
        return <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Sozlamalar</h1>
                <p className="text-neutral-400 mt-1">Tizim va tashqi integratsiyalarni boshqarish</p>
            </div>

            <div className="bg-[#121214] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="border-b border-neutral-800 bg-neutral-900/50 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            Telegram Bot Integratsiyasi
                        </h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            Har bir sotuv haqida Telegram orqali xabar olib turish
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${message.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">
                                Telegram Bot Token
                            </label>
                            <input
                                type="text"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="Masalan: 1234567890:AAH_XYZ..."
                                value={form.telegram_bot_token}
                                onChange={(e) => setForm({ ...form, telegram_bot_token: e.target.value })}
                            />
                            <p className="text-xs text-neutral-500">
                                @BotFather orqali yaratilgan bot tokenni kiriting.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">
                                Chat ID (yoki Kanal Username)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="Masalan: -1001234567890"
                                value={form.telegram_chat_id}
                                onChange={(e) => setForm({ ...form, telegram_chat_id: e.target.value })}
                            />
                            <p className="text-xs text-neutral-500">
                                Xabar yuborilishi kerak bo'lgan guruh yoki admin chat IDsini kiriting. @userinfobot yordamida IDsini bilib olish mumkin.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-neutral-800 mt-6">
                            <button
                                type="button"
                                onClick={handleTestMessage}
                                className="px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Test xabar yuborish
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Saqlash
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
