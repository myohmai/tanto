

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const AddPictureIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M28,12c-.55,0-1,.45-1,1v12c0,.55-.45,1-1,1H6c-.55,0-1-.45-1-1v-12c0-.55.45-1,1-1h2c1.65,0,3-1.35,3-3v-2c0-.55.45-1,1-1h4c.55,0,1-.45,1-1s-.45-1-1-1h-4c-1.65,0-3,1.35-3,3v2c0,.55-.45,1-1,1h-2c-1.65,0-3,1.35-3,3v12c0,1.65,1.35,3,3,3h20c1.65,0,3-1.35,3-3v-12c0-.55-.45-1-1-1Z"/>
                <path d="M10,18c0,3.31,2.69,6,6,6s6-2.69,6-6-2.69-6-6-6-6,2.69-6,6ZM20,18c0,2.21-1.79,4-4,4s-4-1.79-4-4,1.79-4,4-4,4,1.79,4,4Z"/>
                <path d="M19,10h3v3c0,.55.45,1,1,1s1-.45,1-1v-3h3c.55,0,1-.45,1-1s-.45-1-1-1h-3v-3c0-.55-.45-1-1-1s-1,.45-1,1v3h-3c-.55,0-1,.45-1,1s.45,1,1,1Z"/>
            </svg>
    );
};