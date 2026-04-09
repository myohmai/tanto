import { PlusIcon, CheckIcon } from "@/app/components/icons";
import './RoomEnterButton.scss';

type Props = {
    isInSalon: boolean;
    isEntered: boolean;
    onClick: () => void;
}

export const RoomEnterButton = ({ isInSalon, isEntered, onClick }: Props) => {
    const buttonIcon = isEntered ? <CheckIcon size="md" className="room-enter-button__check--in-salon" /> : <PlusIcon size="md" className="room-enter-button__plus"/>;
    const buttonText = isEntered ? <div className="room-enter-button__entered">Entered<CheckIcon className="room-enter-button__check" /></div> : "Enter";
    const buttonClass = `room-enter-button ${isInSalon ? "in-salon" : ""} ${isEntered ? "entered" : ""}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            {isInSalon ? buttonIcon : buttonText}
        </button>
    );
}