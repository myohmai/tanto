import { PlusIcon, CheckIcon } from "@/app/components/icons";
import './RoomEnterButton.scss';

type Props = {
    isInRoom: boolean;
    isEntered: boolean;
    onClick: () => void;
}

export const RoomEnterButton = ({ isInRoom, isEntered, onClick }: Props) => {
    const buttonIcon = isEntered ? <CheckIcon size="md" className="room-enter-button__check--in-salon" /> : <PlusIcon size="md" className="room-enter-button__plus"/>;
    const buttonText = isEntered ? <div className="room-enter-button__entered">Entered<CheckIcon className="room-enter-button__check" /></div> : "Enter";
    const buttonClass = `room-enter-button ${isInRoom ? "in-room" : ""} ${isEntered ? "entered" : ""}`;

    return (
        <button type="button" className={buttonClass} onClick={onClick}>
            {isInRoom ? buttonIcon : buttonText}
        </button>
    );
}