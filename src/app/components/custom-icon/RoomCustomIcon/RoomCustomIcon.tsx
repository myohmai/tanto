import { FondIcon, FondLevel, IconSize } from "@/app/components/icons"; 

type Props = {
    roomIconUrl: string; // URL for the user's custom icon
    subIcon?: { type: 'fond'; value: FondLevel }; // Sub-icon can be a fond with a specific bias color
};

export const RoomCustomIcon = ( {roomIconUrl, subIcon }: Props ) => {
    return (
        <div className="custom-icon__wrapper">
            <div className="custom-icon"><img src={roomIconUrl || '/images/avatar/default-room.png'} alt="Room Icon"className="custom-icon" /></div>
            {subIcon?.type === 'fond' && (<FondIcon size="sm" level={subIcon.value} className="custom-icon__sub-icon" />)}
        </div>
    );
}   