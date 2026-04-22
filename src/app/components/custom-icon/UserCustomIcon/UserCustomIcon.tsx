import { FondIcon, BiasColor, IconSize } from "@/app/components/icons"; 
export type UserSubIcon = 
        | { type: 'emoji'; value: string } // Sub-icon can be an emoji
        | { type: 'fond'; value: BiasColor }; // Sub-icon can be a fond with a specific bias color    

export type UserCustonIconProps = {
    iconUrl?: string; // URL for the user's custom icon
    subIcon?: UserSubIcon;
    className?: string; // Optional additional class name for styling
};

export const UserCustomIcon = ( {iconUrl, subIcon, className }: UserCustonIconProps ) => {
    return (
        <div className={`custom-icon__wrapper ${className || ''}`}>
            <div className="custom-icon"><img src={iconUrl || '/images/avatar/default-user.png'} alt="User Icon"className="custom-icon" /></div>
            {subIcon?.type === 'emoji' && (<span className="custom-icon__sub-icon">{subIcon.value}</span>)}
            {subIcon?.type === 'fond' && (<FondIcon size="sm" bias={subIcon.value} className="custom-icon__sub-icon" />)}
        </div>
    );
}