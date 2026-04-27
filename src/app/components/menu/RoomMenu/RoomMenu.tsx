import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { RoomMuteIcon, ShareIcon, ExclamationIcon } from "@/app/components/icons";

import './RoomMenu.scss'

type Props = {
    onShare: () => void;
    onMute: () => void;
    onReport: () => void;
}

export const RoomMenu = ({ onShare, onMute, onReport }: Props) => {
    return(
        <BottomSheet contentClassName="room-menu stack-md">
            <div className="room-menu__container">
                <BottomMenuButton icon={<ShareIcon/>} label="Share this Room" onClick={onShare} />
            </div>
            <div className="room-menu__container stack-sm">
                <BottomMenuButton icon={<RoomMuteIcon />} label="Mute this Room" onClick={onMute} />
                <BottomMenuButton icon={<ExclamationIcon />} label="Report this Room" onClick={onReport} />
            </div>
        </BottomSheet>
    )
}