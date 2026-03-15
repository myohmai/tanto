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

export const ArrowUpIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M25.37,20.67l-.74.67c-.21.18-.52.17-.71-.04l-7.74-8.6c-.1-.11-.27-.11-.37,0l-7.74,8.6c-.18.21-.5.22-.71.04l-.74-.67c-.21-.18-.22-.5-.04-.71l8.67-9.63c.4-.44,1.09-.44,1.49,0l8.67,9.63c.18.21.17.52-.04.71Z"/>
            </svg>
    );
};