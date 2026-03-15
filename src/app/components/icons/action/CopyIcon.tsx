type IconSize = 'lg' | 'md' | 'sm';

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const CopyIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M26,9h-3v-2c0-1.65-1.35-3-3-3H6c-1.65,0-3,1.35-3,3v14c0,1.65,1.35,3,3,3h3v2c0,1.65,1.35,3,3,3h14c1.65,0,3-1.35,3-3v-14c0-1.65-1.35-3-3-3ZM6,22c-.55,0-1-.45-1-1V7c0-.55.45-1,1-1h14c.55,0,1,.45,1,1v2h-9c-1.65,0-3,1.35-3,3v10h-3ZM27,26c0,.55-.45,1-1,1h-14c-.55,0-1-.45-1-1v-14c0-.55.45-1,1-1h14c.55,0,1,.45,1,1v14Z"/>
            </svg>
    );
};