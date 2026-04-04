
const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const BoxIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M26,4H6c-1.65,0-3,1.35-3,3v3c0,.88.39,1.67,1,2.22v12.78c0,1.65,1.35,3,3,3h18c1.65,0,3-1.35,3-3v-12.78c.61-.55,1-1.34,1-2.22v-3c0-1.65-1.35-3-3-3ZM5,7c0-.55.45-1,1-1h20c.55,0,1,.45,1,1v3c0,.55-.45,1-1,1H6c-.55,0-1-.45-1-1v-3ZM26,25c0,.55-.45,1-1,1H7c-.55,0-1-.45-1-1v-12h20v12Z"/>
                <path d="M10,18h12c.55,0,1-.45,1-1s-.45-1-1-1h-12c-.55,0-1,.45-1,1s.45,1,1,1Z"/>
            </svg>
    );
};