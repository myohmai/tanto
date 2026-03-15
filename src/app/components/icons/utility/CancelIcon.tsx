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

export const CancelIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M16,2c-7.72,0-14,6.28-14,14s6.28,14,14,14,14-6.28,14-14S23.72,2,16,2ZM20.95,19.54l-1.41,1.41-3.54-3.54-3.54,3.54-1.41-1.41,3.54-3.54-3.54-3.54,1.41-1.41,3.54,3.54,3.54-3.54,1.41,1.41-3.54,3.54,3.54,3.54Z"/>
            </svg>
    );
};