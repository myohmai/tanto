

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const QuoteIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M7,16c0-3.86,3.14-7,7-7h7.59l-1.29,1.29c-.39.39-.39,1.02,0,1.41.2.2.45.29.71.29s.51-.1.71-.29l3-3c.39-.39.39-1.02,0-1.41l-3-3c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l1.29,1.29h-7.59c-4.96,0-9,4.04-9,9v2.14c0,.55.45,1,1,1s1-.45,1-1v-2.14Z"/>
                <path d="M26,12.86c-.55,0-1,.45-1,1v2.14c0,3.86-3.14,7-7,7h-7.59l1.29-1.29c.39-.39.39-1.02,0-1.41s-1.02-.39-1.41,0l-3,3c-.39.39-.39,1.02,0,1.41l3,3c.2.2.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.02,0-1.41l-1.29-1.29h7.59c4.96,0,9-4.04,9-9v-2.14c0-.55-.45-1-1-1Z"/>
            </svg>
    );
};