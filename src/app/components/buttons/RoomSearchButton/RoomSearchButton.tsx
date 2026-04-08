import { SearchIcon } from "@/app/components/icons";
import './RoomSearchButton.scss';

type Props = {
    onClick: () => void;
}

export const RoomSearchButton = ({ onClick }: Props) => {
    return (
        <button className="room-search-button" onClick={onClick}>
            <div className="room-search-button__bg" />
            <SearchIcon size="md" className="room-search-button__icon" />
        </button>
    );
}