import { RoomSearchButton } from "@/app/components/buttons/RoomSearchButton";
import { RoomEditButton } from "@/app/components/buttons/RoomEditButton";
import { RoomMenuButton } from "@/app/components/buttons/RoomMenuButton";

import './RoomUtilityContainer.scss'

type Props = {
    onSearch: () => void;
    onEdit: () => void;
    onMenu: () => void;
    className?: string;
}

export const RoomUtilityContainer = ({ onSearch, onEdit,onMenu, className }: Props ) => {
    return (
    <div className={`room-utility-container inline-md ${className ?? ""}`}>
            <RoomSearchButton onClick={onSearch} />
            <RoomEditButton onClick={onEdit} />
            <RoomMenuButton onClick={onMenu} />
        </div>
    )
}