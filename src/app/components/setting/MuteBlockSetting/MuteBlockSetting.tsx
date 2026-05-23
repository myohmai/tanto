'use client';

import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { SettingList } from '@/app/components/setting/SettingList';
import { ProhibitedIcon, RoomMuteIcon, MuteIcon, UserBlockIcon } from '@/app/components/icons';
import { useTranslations } from 'next-intl';

import './MuteBlockSetting.scss';

type Props = {
    onBack:          () => void;
    onMutedRooms:   () => void;
    onMutedSalons:  () => void;
    onBlockedUsers: () => void;
};

export const MuteBlockSetting = ({ onBack, onMutedRooms, onMutedSalons, onBlockedUsers }: Props) => {
    const t = useTranslations('settings');
    return (
        <div className="mute-block-setting bg-color-primary">
            <SettingTopBar
                title={t('muteBlock')}
                icon={<ProhibitedIcon className="icon-color-primary" />}
                onBack={onBack}
            />
            <div className="mute-block-setting__section">
                <div className="mute-block-setting__label text-color-secondary">{t('mute')}</div>
                <SettingList
                    title={t('mutedRooms')}
                    icon={<RoomMuteIcon className="icon-color-primary" />}
                    onClick={onMutedRooms}
                />
                <SettingList
                    title={t('mutedSalons')}
                    icon={<MuteIcon className="icon-color-primary" />}
                    onClick={onMutedSalons}
                />
            </div>
            <div className="mute-block-setting__section">
                <div className="mute-block-setting__label text-color-secondary">{t('block')}</div>
                <SettingList
                    title={t('blockedUsers')}
                    icon={<UserBlockIcon className="icon-color-primary" />}
                    onClick={onBlockedUsers}
                />
            </div>
        </div>
    );
};
