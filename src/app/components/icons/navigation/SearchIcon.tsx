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

export const SearchIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M18,3c-6.07,0-11,4.93-11,11,0,2.67.96,5.13,2.55,7.03l-5.67,5.67c-.39.39-.39,1.02,0,1.41.2.2.45.29.71.29s.51-.1.71-.29l5.67-5.67c1.91,1.59,4.36,2.55,7.03,2.55,6.07,0,11-4.93,11-11S24.07,3,18,3ZM18,23c-4.96,0-9-4.04-9-9s4.04-9,9-9,9,4.04,9,9-4.04,9-9,9Z"/>
            </svg>
    );
};