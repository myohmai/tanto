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

export const ExclamationIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <circle cx="16" cy="22" r="1.5"/>
                <path d="M16,3c-7.17,0-13,5.83-13,13s5.83,13,13,13,13-5.83,13-13S23.17,3,16,3ZM16,27c-6.07,0-11-4.93-11-11s4.93-11,11-11,11,4.93,11,11-4.93,11-11,11Z"/>
                <path d="M14,11l.5,7c.14,1.83,2.85,1.84,3,0l.5-7c.1-2.83-4.1-2.83-4,0Z"/>
            </svg>
    );
};