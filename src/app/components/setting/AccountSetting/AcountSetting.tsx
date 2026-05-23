'use client';
import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { AccountIcon } from "@/app/components/icons";
import { SettingListSecondary } from "@/app/components/setting/SettingListSecondary";
import { DeleteButton } from "@/app/components/buttons/DeleteButton";
import { useTranslations } from 'next-intl';

import './AcountSetting.scss'

type Props = {
    onBack: () => void;
    onEmail: () => void;
    recentEmail: string;
    onPassword: () => void;
    onConnected: () => void;
    connectedAccount: string;
    onLangage: () => void;
    recentLangage: string;
    onDelete: () => void;
}

export const AccountSetting = ({ onBack, onEmail, recentEmail, onPassword, onConnected, connectedAccount, onLangage, recentLangage, onDelete }: Props) => {
    const t = useTranslations('settings');
    return (
        <div className="account-setting bg-color-primary">
            <div className="account-setting__wrapper">
                <SettingTopBar
                    title={t('account')}
                    icon={<AccountIcon className="icon-color-primary" />}
                    onBack={onBack}
                />
                <SettingListSecondary
                    title={t('email')}
                    text={recentEmail}
                    onClick={onEmail}
                />
                <SettingListSecondary
                    title={t('password')}
                    onClick={onPassword}
                />
                <SettingListSecondary
                    title={t('connected')}
                    text={connectedAccount}
                    onClick={onConnected}
                />
                <SettingListSecondary
                    title={t('language')}
                    text={recentLangage}
                    onClick={onLangage}
                />
            </div>
            <div className="account-setting__delete">
                <DeleteButton label={t('deleteAccount')} onClick={onDelete} />
            </div>
        </div>
    );
}
