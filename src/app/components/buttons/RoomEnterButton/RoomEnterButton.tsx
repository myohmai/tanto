"use client";
import { PlusIcon, CheckIcon } from "@/app/components/icons";
import { useTranslations } from 'next-intl';
import './RoomEnterButton.scss';

type Props = {
    isInRoom: boolean;
    isEntered: boolean;
    onClick: () => void;
    className?: string;
}

export const RoomEnterButton = ({ isInRoom, isEntered, onClick, className }: Props) => {
    const t = useTranslations('room');
    const buttonIcon = isEntered ? <CheckIcon size="md" className="room-enter-button__check--in-salon" /> : <PlusIcon size="md" className="room-enter-button__plus"/>;
    const buttonText = isEntered ? <div className="room-enter-button__entered">{t('entered')}<CheckIcon className="room-enter-button__check" /></div> : t('enter');
    const buttonClass = `room-enter-button ${isInRoom ? "in-room" : ""} ${isEntered ? "entered" : ""}`;

    return (
        <button type="button" className={`${buttonClass} ${className ?? ""}`} onClick={onClick}>
            {isInRoom ? buttonIcon : buttonText}
        </button>
    );
}