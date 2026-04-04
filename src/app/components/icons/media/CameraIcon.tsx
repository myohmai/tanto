

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const CameraIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M26,28H6c-1.65,0-3-1.35-3-3v-12c0-1.65,1.35-3,3-3h2c.55,0,1-.45,1-1v-2c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3v2c0,.55.45,1,1,1h2c1.65,0,3,1.35,3,3v12c0,1.65-1.35,3-3,3ZM6,12c-.55,0-1,.45-1,1v12c0,.55.45,1,1,1h20c.55,0,1-.45,1-1v-12c0-.55-.45-1-1-1h-2c-1.65,0-3-1.35-3-3v-2c0-.55-.45-1-1-1h-8c-.55,0-1,.45-1,1v2c0,1.65-1.35,3-3,3h-2Z"/>
            <path d="M16,24c-3.31,0-6-2.69-6-6s2.69-6,6-6,6,2.69,6,6-2.69,6-6,6ZM16,14c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4Z"/>
            </svg>
    );
};