import { useEffect, useState } from "react";
import { FondIcon, BiasColor } from "@/app/components/icons"; 
export type UserSubIcon = 
        | { type: 'emoji'; value: string } // Sub-icon can be an emoji
        | { type: 'fond'; value: BiasColor }; // Sub-icon can be a fond with a specific bias color    

export type UserCustomIconProps = {
    iconUrl?: string | null; // URL for the user's custom icon
    subIcon?: UserSubIcon | null;
    className?: string; // Optional additional class name for styling
};

export const UserCustomIcon = ( {iconUrl, subIcon, className }: UserCustomIconProps ) => {
    const [src, setSrc] = useState<string>(iconUrl || '/images/avatar/default-user.png');

    useEffect(() => {
        setSrc(iconUrl || '/images/avatar/default-user.png');
    }, [iconUrl]);

    return (
        <div className={`custom-icon__wrapper ${className || ''}`}>
            <div className="custom-icon">
                <img
                    src={src}
                    alt="User Icon"
                    className="custom-icon"
                    onError={() => setSrc('/images/avatar/default-user.png')}
                />
            </div>
            {subIcon?.type === 'emoji' && (<span className="custom-icon__sub-icon">{subIcon.value}</span>)}
            {subIcon?.type === 'fond' && (<FondIcon size="sm" bias={subIcon.value} className="custom-icon__sub-icon" />)}
        </div>
    );
}