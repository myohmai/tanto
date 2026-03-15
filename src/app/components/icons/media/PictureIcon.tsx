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

export const PictureIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M25,4H7c-1.65,0-3,1.35-3,3v18c0,1.65,1.35,3,3,3h18c1.65,0,3-1.35,3-3V7c0-1.65-1.35-3-3-3ZM7,6h18c.55,0,1,.45,1,1v9.92l-3.38-2.7c-.4-.32-.97-.29-1.33.07l-5.49,5.49-5.36-2.68c-.35-.17-.77-.13-1.07.11l-3.38,2.7V7c0-.55.45-1,1-1ZM25,26H7c-.55,0-1-.45-1-1v-2.52l4.12-3.3,5.43,2.71c.39.19.85.12,1.15-.19l5.37-5.37,3.93,3.14v5.52c0,.55-.45,1-1,1Z"/>
                <path d="M11,15c2.21,0,4-1.79,4-4s-1.79-4-4-4-4,1.79-4,4,1.79,4,4,4ZM11,9c1.1,0,2,.9,2,2s-.9,2-2,2-2-.9-2-2,.9-2,2-2Z"/>
            </svg>
    );
};