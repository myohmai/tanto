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

export const CrossIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M17.41,16l9.29-9.29c.39-.39.39-1.02,0-1.41s-1.02-.39-1.41,0l-9.29,9.29L6.71,5.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l9.29,9.29-9.29,9.29c-.39.39-.39,1.02,0,1.41.2.2.45.29.71.29s.51-.1.71-.29l9.29-9.29,9.29,9.29c.2.2.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.02,0-1.41l-9.29-9.29Z"/>
            </svg>
    );
};