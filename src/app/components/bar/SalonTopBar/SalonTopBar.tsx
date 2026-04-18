import { BackButton  } from "@/app/components/buttons/BackButton";
import { MenuButton } from "@/app/components/buttons/MenuButton";
import { WhereYouAre } from "@/app/components/content/WhereYouAre"

import './SalonTopBar.scss'

type Props = {
    roomName: string;
    salonName: string;
    onBack: () => void;
    onMenu: () => void;
    onRoom: () => void;
    onSalon: () => void;
}

export const SalonTopBar = ({ roomName, salonName, onBack, onMenu, onRoom, onSalon }: Props ) => {
    return(
        <div className="salon-top-bar padding-md bg-color-primary text-color-primary">
            <div className="salon-top-bar__container inline-lg">
                <BackButton onClick={onBack} />
                <WhereYouAre isInSalon={true} roomName={roomName} salonName={salonName} onRoom={onRoom} onSalon={onSalon} />
            </div>
            <MenuButton onClick={onMenu} />
        </div>
    )
}