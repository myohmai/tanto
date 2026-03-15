type IconSize = 'lg' | 'md' | 'sm';

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
    variant?: 'line' | 'fill';
}

export const BookMarkIcon = ({ size = 'md', className = '', variant = 'line' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                {variant === 'fill'
                    ? <path d="M23,3h-13c-1.65,0-3,1.35-3,3v21c0,.76.42,1.45,1.11,1.79.68.34,1.48.27,2.09-.19l5.83-4.38,6.86,4.57c.33.22.72.34,1.11.34.32,0,.65-.08.95-.24.65-.35,1.06-1.02,1.06-1.76V6c0-1.65-1.35-3-3-3Z"/>
                    : <path d="M24,29.13c-.39,0-.77-.11-1.11-.34l-6.86-4.57-5.83,4.38c-.61.46-1.41.53-2.09.19-.68-.34-1.11-1.03-1.11-1.79V6c0-1.65,1.35-3,3-3h13c1.65,0,3,1.35,3,3v21.13c0,.74-.4,1.41-1.06,1.76-.3.16-.62.24-.95.24ZM24,27.13h0s0-21.13,0-21.13c0-.55-.45-1-1-1h-13c-.55,0-1,.45-1,1v21l5.83-4.38c.68-.51,1.61-.53,2.31-.06l6.86,4.57Z"/>
                    }
            </svg>
    );
};