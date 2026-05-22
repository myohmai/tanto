'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { SettingTop }        from '@/app/components/setting/SettingTop';
import { AccountSetting }    from '@/app/components/setting/AccountSetting';
import { EmailSetting }      from '@/app/components/setting/EmailSetting';
import { PasswordSetting }   from '@/app/components/setting/PasswordSetting';
import { LanguageSetting }   from '@/app/components/setting/LanguageSetting';
import { ThemeSetting }      from '@/app/components/setting/ThemeSetting';
import { MuteBlockSetting }  from '@/app/components/setting/MuteBlockSetting';
import { MutedRoomList }     from '@/app/components/setting/MutedRoomList';
import { MutedSalonList }    from '@/app/components/setting/MutedSalonList';
import { BlockedList }       from '@/app/components/setting/BlockedList';

type SettingView =
    | 'top'
    | 'account' | 'email' | 'password' | 'language'
    | 'theme'
    | 'muteBlock' | 'mutedRooms' | 'mutedSalons' | 'blockedUsers';

export default function SettingsPage() {
    const router = useRouter();
    const [view, setView] = useState<SettingView>('top');
    const [email, setEmail] = useState('');
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email ?? '');
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    const handleEmailUpdate = async (newEmail: string) => {
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (!error) setEmail(newEmail);
        setView('account');
    };

    const handlePasswordUpdate = async (newPassword: string) => {
        await supabase.auth.updateUser({ password: newPassword });
        setView('account');
    };

    const handleTheme = (value: string) => {
        document.documentElement.classList.toggle('night', value === 'dark');
    };

    return (
        <div>
            {view === 'top' && (
                <SettingTop
                    onBack={() => router.back()}
                    onAccount={() => setView('account')}
                    onTheme={() => setView('theme')}
                    onMute={() => setView('muteBlock')}
                    onLogout={handleLogout}
                />
            )}

            {view === 'account' && (
                <AccountSetting
                    onBack={() => setView('top')}
                    onEmail={() => setView('email')}
                    recentEmail={email}
                    onPassword={() => setView('password')}
                    onConnected={() => {}}
                    connectedAccount=""
                    onLangage={() => setView('language')}
                    recentLangage={language}
                    onDelete={() => {}}
                />
            )}

            {view === 'email' && (
                <EmailSetting
                    recentEmail={email}
                    onBack={() => setView('account')}
                    onSubmit={handleEmailUpdate}
                />
            )}

            {view === 'password' && (
                <PasswordSetting
                    onBack={() => setView('account')}
                    onSubmit={handlePasswordUpdate}
                />
            )}

            {view === 'language' && (
                <LanguageSetting
                    onBack={() => setView('account')}
                    onTheme={(value) => {
                        setLanguage(value);
                        setView('account');
                    }}
                />
            )}

            {view === 'theme' && (
                <ThemeSetting
                    onBack={() => setView('top')}
                    onTheme={handleTheme}
                />
            )}

            {view === 'muteBlock' && (
                <MuteBlockSetting
                    onBack={() => setView('top')}
                    onMutedRooms={() => setView('mutedRooms')}
                    onMutedSalons={() => setView('mutedSalons')}
                    onBlockedUsers={() => setView('blockedUsers')}
                />
            )}

            {view === 'mutedRooms'   && <MutedRoomList  onBack={() => setView('muteBlock')} />}
            {view === 'mutedSalons'  && <MutedSalonList onBack={() => setView('muteBlock')} />}
            {view === 'blockedUsers' && <BlockedList    onBack={() => setView('muteBlock')} />}
        </div>
    );
}
