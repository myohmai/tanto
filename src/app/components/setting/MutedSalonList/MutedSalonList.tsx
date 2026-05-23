'use client';

import { useEffect, useState } from 'react';
import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { MuteIcon, CancelIcon, FondIcon } from '@/app/components/icons';
import { getMutedSalons, deleteMuteById, type MutedSalon } from '@/repositories/mute';
import { getCurrentUserId } from '@/repositories/currentUser';
import { useTranslations } from 'next-intl';

import './MutedSalonList.scss';

type Props = {
    onBack: () => void;
};

export const MutedSalonList = ({ onBack }: Props) => {
    const t = useTranslations('settings');
    const [mutes, setMutes] = useState<MutedSalon[]>([]);

    useEffect(() => {
        const load = async () => {
            const userId = await getCurrentUserId();
            const data = await getMutedSalons(userId);
            setMutes(data);
        };
        load();
    }, []);

    const handleUnmute = async (id: string) => {
        await deleteMuteById(id);
        setMutes(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="muted-salon-list bg-color-primary">
            <SettingTopBar
                title={t('mutedSalons')}
                icon={<MuteIcon className="icon-color-primary" />}
                onBack={onBack}
            />

            {mutes.length === 0 ? (
                <div className="muted-salon-list__empty text-color-secondary">
                    {t('noMutedSalons')}
                </div>
            ) : (
                <ul className="muted-salon-list__items">
                    {mutes.map(mute => (
                        <li key={mute.id} className="muted-salon-list__item padding-sm-lg">
                            <div className="muted-salon-list__salon">
                                <div className="muted-salon-list__icon">
                                    {mute.salonIcon.type === 'emoji' && (
                                        <span className="muted-salon-list__emoji">
                                            {mute.salonIcon.value}
                                        </span>
                                    )}
                                    {mute.salonIcon.type === 'fond' && (
                                        <FondIcon
                                            size="md"
                                            bias={mute.salonIcon.value}
                                        />
                                    )}
                                </div>
                                <div className="muted-salon-list__info">
                                    <span className="muted-salon-list__name text-color-primary">
                                        {mute.salonName}
                                    </span>
                                    {mute.roomName && (
                                        <span className="muted-salon-list__room text-color-secondary">
                                            {mute.roomName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="muted-salon-list__unmute"
                                onClick={() => handleUnmute(mute.id)}
                                aria-label={t('mutedSalons')}
                            >
                                <CancelIcon className="icon-color-secondary" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
