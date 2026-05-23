'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { ShareIcon, MessageIcon, UserBlockIcon, ExclamationIcon, IdIcon } from '@/app/components/icons';
import { useTranslations } from 'next-intl';

import './GlossMenu.scss'

type Props = {
    onShare: () => void;
    onMessage: () => void;
    onBlock: () => void;
    onReport: () => void;
    onId: () => void;
    isOpen: boolean;
    onClose: () => void;
    isBlocked: boolean;
    isOwn: boolean;
}

export const GlossMenu = ({ onShare, onMessage, onBlock, onReport, onId, isOpen, onClose, isBlocked, isOwn } : Props) => {
    const t = useTranslations('glossMenu');
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="gloss-menu stack-md">
            <div className="gloss-menu__container stack-sm">
                <BottomMenuButton icon={<ShareIcon/>} label={t('share')} onClick={onShare} />
                {!isOwn && (
                    <BottomMenuButton icon={<MessageIcon variant="line"/>} label={t('acceptMessage')} onClick={onMessage}/>
                )}
            </div>
            <div className="gloss-menu__container stack-sm">
                {!isOwn && (
                    <>
                        <BottomMenuButton icon={<UserBlockIcon />} label={isBlocked ? t('unblock') : t('block')} onClick={onBlock} />
                        <BottomMenuButton icon={<ExclamationIcon />} label={t('report')} onClick={onReport} />
                    </>
                )}
                <BottomMenuButton icon={<IdIcon />} label={t('showId')} onClick={onId} />
            </div>
        </BottomSheet>
    )
}
