

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const CircleIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M16,29c-7.17,0-13-5.83-13-13S8.83,3,16,3s13,5.83,13,13-5.83,13-13,13ZM16,5c-6.07,0-11,4.93-11,11s4.93,11,11,11,11-4.93,11-11-4.93-11-11-11Z"/>
            </svg>
    );
};