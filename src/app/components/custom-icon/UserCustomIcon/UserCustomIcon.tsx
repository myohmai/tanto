import { FondIcon, BiasColor, IconSize } from "@/app/components/icons"; 

type Props = {
    iconUrl: string; // URL for the user's custom icon
    subIcon?: 
        | { type: 'emoji'; value: string } // Sub-icon can be an emoji
        | { type: 'fond'; value: BiasColor }; // Sub-icon can be a fond with a specific bias color
};

export const UserCustomIcon = ( {iconUrl, subIcon }: Props ) => {
    return (
        <div className="custom-icon__wrapper">
            <div className="custom-icon"><img src={iconUrl || '/images/avatar/default-user.png'} alt="User Icon"className="custom-icon" /></div>
            {subIcon?.type === 'emoji' && (<span className="custom-icon__sub-icon">{subIcon.value}</span>)}
            {subIcon?.type === 'fond' && (<FondIcon size="sm" bias={subIcon.value} className="custom-icon__sub-icon" />)}
        </div>
    );
}