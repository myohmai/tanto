

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const LocationIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M16,4c-4.96,0-9,4.04-9,9,0,7.37,8,14.45,8.34,14.75.19.17.42.25.66.25s.47-.08.66-.25c.34-.3,8.34-7.38,8.34-14.75,0-4.96-4.04-9-9-9ZM16,25.63c-1.86-1.81-7-7.31-7-12.63,0-3.86,3.14-7,7-7s7,3.14,7,7c0,5.32-5.14,10.82-7,12.63Z"/>
                <path d="M16,9c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4ZM16,15c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Z"/>
            </svg>
    );
};