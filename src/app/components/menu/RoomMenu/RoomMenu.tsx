'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { RoomMuteIcon, ShareIcon, ExclamationIcon } from "@/app/components/icons";
import { useTranslations } from 'next-intl';

import './RoomMenu.scss'

type Props = {
    onShare: () => void;
    onMute: () => void;
    onReport: () => void;
    isOpen: boolean;
    onClose: () => void;
    isMuted: boolean;
    isOwn?: boolean;
}

export const RoomMenu = ({ onShare, onMute, onReport, isOpen, onClose, isMuted, isOwn }: Props) => {
    const t = useTranslations('roomMenu');
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="room-menu stack-md">
            <div className="room-menu__container">
                <BottomMenuButton icon={<ShareIcon/>} label={t('share')} onClick={onShare} />
            </div>
            {!isOwn && (
                <div className="room-menu__container stack-sm">
                    <BottomMenuButton icon={<RoomMuteIcon />} label={isMuted ? t('unmute') : t('mute')} onClick={onMute} />
                    <BottomMenuButton icon={<ExclamationIcon />} label={t('report')} onClick={onReport} />
                </div>
            )}
        </BottomSheet>
    )
}
