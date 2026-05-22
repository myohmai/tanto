'use client';

import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { FondIcon, MuteIcon, CancelIcon } from '@/app/components/icons';
import type { SalonIcon } from '@/app/types/salon';

import '@/app/components/setting/MutedSalonList/MutedSalonList.scss';

const MOCK_MUTED_SALONS: {
    id: string;
    salonName: string;
    salonIcon: SalonIcon;
    roomName: string | null;
}[] = [
    {
        id: '1',
        salonName: 'General',
        salonIcon: { type: 'emoji', value: '💬' },
        roomName: 'Novel Club',
    },
    {
        id: '2',
        salonName: 'Playlist',
        salonIcon: { type: 'emoji', value: '🎵' },
        roomName: 'Music Room',
    },
    {
        id: '3',
        salonName: 'Hot Topics',
        salonIcon: { type: 'fond', value: 'red' },
        roomName: 'Design Room',
    },
    {
        id: '4',
        salonName: 'Archive',
        salonIcon: { type: 'emoji', value: '📁' },
        roomName: null,
    },
];

export default function Home() {
    return (
        <div className="muted-salon-list bg-color-primary">
            <SettingTopBar
                title="Muted Salons"
                icon={<MuteIcon className="icon-color-primary" />}
                onBack={() => {}}
            />
            <ul className="muted-salon-list__items">
                {MOCK_MUTED_SALONS.map(mute => (
                    <li key={mute.id} className="muted-salon-list__item padding-sm-lg">
                        <div className="muted-salon-list__salon">
                            <div className="muted-salon-list__icon">
                                {mute.salonIcon.type === 'emoji' && (
                                    <span className="muted-salon-list__emoji">
                                        {mute.salonIcon.value}
                                    </span>
                                )}
                                {mute.salonIcon.type === 'fond' && (
                                    <FondIcon size="md" bias={mute.salonIcon.value} />
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
                            aria-label="Unmute"
                        >
                            <CancelIcon className="icon-color-secondary" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
