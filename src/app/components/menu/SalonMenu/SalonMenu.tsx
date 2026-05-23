'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { PinIcon, EditIcon, ProhibitedIcon } from "@/app/components/icons";
import { useTranslations } from 'next-intl';

import './SalonMenu.scss'

type Props = {
    onPin: () => void;
    onEdit: () => void;
    onMute: () => void;
    isHost: boolean;
    isOpen: boolean;
    onClose: () => void;
    isMuted: boolean;
}

export const SalonMenu = ({ onPin, onEdit, onMute, isHost, isOpen, onClose, isMuted }: Props) => {
    const t = useTranslations('salonMenu');
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="salon-menu stack-md" >
            {isHost && <BottomMenuButton icon={<PinIcon />} label={t('pin')} onClick={onPin} />}
            <BottomMenuButton icon={<EditIcon />} label={t('edit')} onClick={onEdit} />
            <BottomMenuButton icon={<ProhibitedIcon />} label={isMuted ? t('unmute') : t('mute')} onClick={onMute} />
        </BottomSheet>
    )
}
