import { RoomSearchButton } from "@/app/components/buttons/RoomSearchButton";
import { RoomEditButton } from "@/app/components/buttons/RoomEditButton";
import { RoomMenuButton } from "@/app/components/buttons/RoomMenuButton";

import './RoomUtilityContainer.scss'

type Props = {
    onClick: () => void;
}

export const RoomUtilityContainer = ({ onClick }: Props ) => {
    return (
        <div className="room-utility-container inline-md">
            <RoomSearchButton onClick={onClick} />
            <RoomEditButton onClick={onClick} />
            <RoomMenuButton onClick={onClick} />
        </div>
    )
}