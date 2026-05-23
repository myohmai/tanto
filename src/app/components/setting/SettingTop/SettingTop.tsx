'use client';
import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingList } from "@/app/components/setting/SettingList";
import { SettingIcon, AccountIcon, LightIcon, ProhibitedIcon, ExclamationIcon, InfoIcon, LockIcon } from '@/app/components/icons';
import { LogOutButton } from "@/app/components/buttons/LogOutButton";
import { useTranslations } from 'next-intl';

import './SettingTop.scss'

type Props = {
    onBack: () => void;
    onAccount: () => void;
    onTheme: () => void;
    onMute: () => void;
    onContact: () => void;
    onLogout: () => void;
}

export const SettingTop = ({ onBack, onAccount, onTheme, onMute, onContact, onLogout }: Props) => {
    const t = useTranslations('settings');
    return (
        <div className="setting-top bg-color-primary">
            <div className="setting-top__wrapper">
                <SettingTopBar
                    title={t('title')}
                    icon={<SettingIcon className="icon-color-primary" />}
                    onBack={onBack}
                />
                <SettingList
                    title={t('account')}
                    icon={<AccountIcon className="icon-color-primary" />}
                    onClick={onAccount}
                />
                <SettingList
                    title={t('theme')}
                    icon={<LightIcon className="icon-color-primary" />}
                    onClick={onTheme}
                />
                <SettingList
                    title={t('muteBlock')}
                    icon={<ProhibitedIcon className="icon-color-primary" />}
                    onClick={onMute}
                />
                <SettingList
                    title={t('contact')}
                    icon={<ExclamationIcon className="icon-color-primary" />}
                    onClick={onContact}
                />
                <SettingList
                    title={t('terms')}
                    icon={<InfoIcon className="icon-color-primary" />}
                    onClick={() => window.open('https://www.notion.so/369df9d71ebe80949262dfcd29df09bd', '_blank', 'noopener,noreferrer')}
                />
                <SettingList
                    title={t('privacy')}
                    icon={<LockIcon className="icon-color-primary" />}
                    onClick={() => window.open('https://www.notion.so/369df9d71ebe80a5b9bdd359d085d43e', '_blank', 'noopener,noreferrer')}
                />
            </div>
            <div className="setting-top__logout">
                <LogOutButton onClick={onLogout} />
            </div>
        </div>
    );
}
