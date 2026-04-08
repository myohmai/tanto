import { MenuIcon } from "@/app/components/icons";
import './RoomMenuButton.scss';

type Props = {
    onClick: () => void;
}

export const RoomMenuButton = ({ onClick }: Props) => {
    return (
        <button className="room-menu-button" onClick={onClick}>
            <div className="room-menu-button__bg" />
            <MenuIcon size="md" className="room-menu-button__icon" />
        </button>
    );
}