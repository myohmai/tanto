'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { UserBlockIcon } from "@/app/components/icons";

import './TopicListMenu.scss'

type Props = {
    onBlock: () => void;
    isOpen: boolean;
    onClose: () => void;
    isBlocked: boolean;
}

export const TopicListMenu = ({ onBlock, isOpen, onClose, isBlocked }: Props) => {
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="topic-list-menu stack-md" >
                <BottomMenuButton icon={<UserBlockIcon />} label={isBlocked ? "Unblock this user" : "Block this user"} onClick={onBlock} />
        </BottomSheet>
    )
}