import { BackButton  } from "@/app/components/buttons/BackButton";
import { RoomEnterButton } from "@/app/components/buttons/RoomEnterButton";
import { WhereYouAre } from "@/app/components/content/WhereYouAre"

import './RoomTopBar.scss'

type Props = {
    roomName: string;
    onBack: () => void;
    onEnter: () => void;
    isEntered: boolean;
    onRoom: () => void;
}

export const RoomTopBar = ({ roomName, onBack, onEnter, isEntered, onRoom }: Props ) => {
    return(
        <div className="room-top-bar padding-md bg-color-primary text-color-primary">
            <div className="room-top-bar__container inline-lg">
                <BackButton onClick={onBack} />
                <WhereYouAre isInSalon={false} roomName={roomName} onRoom={onRoom} />
            </div>
            <RoomEnterButton isInRoom={true} isEntered={isEntered} onClick={onEnter} />
        </div>
    )
}