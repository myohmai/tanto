import { BackButton  } from "@/app/components/buttons/BackButton";
import { MenuButton } from "@/app/components/buttons/MenuButton";
import { WhereYouAre } from "@/app/components/content/WhereYouAre"

import { SalonMenu } from "@/app/components/menu/SalonMenu";

import { useState } from "react";

import './SalonTopBar.scss'

type Props = {
    roomName: string;
    salonName: string;
    onBack: () => void;
    onRoom: () => void;
    onSalon: () => void;
    onPin: () => void;
    onEdit: () => void;
    onMute: () => void;
    isHost: boolean;
}

export const SalonTopBar = ({ 
    roomName, 
    salonName, 
    onBack, 
    onRoom, 
    onSalon,
    onPin,
    onEdit,
    onMute,
    isHost
}: Props ) => {
    const [menuOpen, setMenuOpen] = useState(false)
    return(
        <div className="salon-top-bar padding-md bg-color-primary text-color-primary">
            <div className="salon-top-bar__container inline-lg">
                <BackButton onClick={onBack} />
                <WhereYouAre isInRoom={false} isInSalon={false} roomName={roomName} salonName={salonName} onRoom={onRoom} onSalon={onSalon} />
            </div>
            <MenuButton onClick={() => setMenuOpen(true)} />
                <SalonMenu
                    onPin={onPin} 
                    onEdit={onEdit} 
                    onMute={onMute} 
                    isHost={isHost}
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)} 
                />
        </div>
    )
}