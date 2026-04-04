

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const PlayIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M23.39,13.41l-11.94-6.63c-.94-.52-2.05-.51-2.98.04-.93.54-1.48,1.51-1.48,2.59v13.5c0,1.08.56,2.05,1.5,2.6.47.27.99.41,1.5.41s1.03-.13,1.5-.4l11.94-6.87c.95-.55,1.51-1.53,1.5-2.62,0-1.1-.59-2.07-1.54-2.6Z"/>
            </svg>
    );
};