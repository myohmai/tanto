'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { ShareIcon, MessageIcon, UserBlockIcon,ExclamationIcon, IdIcon } from '@/app/components/icons'

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
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="gloss-menu stack-md">
            <div className="gloss-menu__container stack-sm">
                <BottomMenuButton icon={<ShareIcon/>} label="Share this Gloss" onClick={onShare} />
                {!isOwn && (
                    <BottomMenuButton icon={<MessageIcon variant="line"/>} label="Accept Message from this user" onClick={onMessage}/>
                )}
            </div>
            <div className="gloss-menu__container stack-sm">
                {!isOwn && (
                    <>
                        <BottomMenuButton icon={<UserBlockIcon />} label={isBlocked ? "Unblock this user" : "Block this user"} onClick={onBlock} />                
                        <BottomMenuButton icon={<ExclamationIcon />} label="Report this Gloss" onClick={onReport} />
                    </>
                )}
                <BottomMenuButton icon={<IdIcon />} label="Show Gloss ID" onClick={onId} />
            </div>
        </BottomSheet>
    )
}