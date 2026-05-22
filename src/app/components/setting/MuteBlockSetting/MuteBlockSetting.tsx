'use client';

import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { SettingList } from '@/app/components/setting/SettingList';
import { ProhibitedIcon, RoomMuteIcon, MuteIcon, UserBlockIcon } from '@/app/components/icons';

import './MuteBlockSetting.scss';

type Props = {
    onBack:          () => void;
    onMutedRooms:   () => void;
    onMutedSalons:  () => void;
    onBlockedUsers: () => void;
};

export const MuteBlockSetting = ({ onBack, onMutedRooms, onMutedSalons, onBlockedUsers }: Props) => {
    return (
        <div className="mute-block-setting bg-color-primary">
            <SettingTopBar
                title="Mute / Block"
                icon={<ProhibitedIcon className="icon-color-primary" />}
                onBack={onBack}
            />
            <div className="mute-block-setting__section">
                <div className="mute-block-setting__label text-color-secondary">Mute</div>
                <SettingList
                    title="Muted Rooms"
                    icon={<RoomMuteIcon className="icon-color-primary" />}
                    onClick={onMutedRooms}
                />
                <SettingList
                    title="Muted Salons"
                    icon={<MuteIcon className="icon-color-primary" />}
                    onClick={onMutedSalons}
                />
            </div>
            <div className="mute-block-setting__section">
                <div className="mute-block-setting__label text-color-secondary">Block</div>
                <SettingList
                    title="Blocked Users"
                    icon={<UserBlockIcon className="icon-color-primary" />}
                    onClick={onBlockedUsers}
                />
            </div>
        </div>
    );
};
