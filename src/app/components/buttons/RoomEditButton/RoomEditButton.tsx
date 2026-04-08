import { EditIcon } from "@/app/components/icons";
import './RoomEditButton.scss';

type Props = {
    onClick: () => void;
}

export const RoomEditButton = ({ onClick }: Props) => {
    return (
        <button className="room-edit-button" onClick={onClick}>
            <div className="room-edit-button__bg" />
            <EditIcon size="md" className="room-edit-button__icon" />
        </button>
    );
}