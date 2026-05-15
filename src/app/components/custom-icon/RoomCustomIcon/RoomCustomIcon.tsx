import { FondIcon, FondLevel, IconSize } from "@/app/components/icons"; 

export type roomSubIcon =  { type: 'fond'; value: FondLevel };

export type RoomCustomIconProps = {
    roomIconUrl?: string | null; // URL for the user's custom icon
    subIcon?: roomSubIcon; // Sub-icon can be a fond with a specific bias color
    className?: string;
};

export const RoomCustomIcon = ( {roomIconUrl, subIcon, className }: RoomCustomIconProps ) => {
    return (
        <div className={`custom-icon__wrapper ${className ?? ""}`}>
            <div className="custom-icon"><img src={roomIconUrl || '/images/avatar/default-room.png'} alt="Room Icon" className="custom-icon" /></div>
            {subIcon?.type === 'fond' && (<FondIcon size="sm" level={subIcon.value} className="custom-icon__sub-icon" />)}
        </div>
    );
}   