'use client';

import { useEffect, useState } from 'react';
import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { RoomCustomIcon } from '@/app/components/custom-icon/RoomCustomIcon';
import { RoomMuteIcon, CancelIcon } from '@/app/components/icons';
import { getMutedRooms, deleteMuteById, type MutedRoom } from '@/repositories/mute';
import { getCurrentUserId } from '@/repositories/currentUser';

import './MutedRoomList.scss';

type Props = {
    onBack: () => void;
};

export const MutedRoomList = ({ onBack }: Props) => {
    const [mutes, setMutes] = useState<MutedRoom[]>([]);

    useEffect(() => {
        const load = async () => {
            const userId = await getCurrentUserId();
            const data = await getMutedRooms(userId);
            setMutes(data);
        };
        load();
    }, []);

    const handleUnmute = async (id: string) => {
        await deleteMuteById(id);
        setMutes(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="muted-room-list bg-color-primary">
            <SettingTopBar
                title="Muted Rooms"
                icon={<RoomMuteIcon className="icon-color-primary" />}
                onBack={onBack}
            />

            {mutes.length === 0 ? (
                <div className="muted-room-list__empty text-color-secondary">
                    No muted rooms
                </div>
            ) : (
                <ul className="muted-room-list__items">
                    {mutes.map(mute => (
                        <li key={mute.id} className="muted-room-list__item padding-sm-lg">
                            <div className="muted-room-list__room">
                                <RoomCustomIcon
                                    roomIconUrl={mute.roomIconUrl}
                                    className="muted-room-list__icon"
                                />
                                <span className="muted-room-list__name text-color-primary">
                                    {mute.roomName ?? 'Unknown Room'}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="muted-room-list__unmute"
                                onClick={() => handleUnmute(mute.id)}
                                aria-label="Unmute"
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
