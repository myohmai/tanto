import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { PinIcon, EditIcon, ProhibitedIcon } from "@/app/components/icons";

import './SalonMenu.scss'

type Props = {
    onPin: () => void;
    onEdit: () => void;
    onMute: () => void;
    isHost: Boolean;
}

export const SalonMenu = ({ onPin, onEdit, onMute, isHost }: Props) => {
    return(
        <BottomSheet contentClassName="salon-menu stack-md" >
                {isHost &&  <BottomMenuButton icon={<PinIcon />} label="Pin this Salon" onClick={onPin} />}
                <BottomMenuButton icon={<EditIcon />} label="Edit this Salon" onClick={onEdit} />
                <BottomMenuButton icon={<ProhibitedIcon />} label="Mute this Salon" onClick={onMute} />
        </BottomSheet>
    )
}