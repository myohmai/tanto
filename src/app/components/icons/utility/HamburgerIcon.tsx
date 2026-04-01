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

export const HamburgerIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M26,11H6c-.55,0-1-.45-1-1s.45-1,1-1h20c.55,0,1,.45,1,1s-.45,1-1,1Z"/>
            <path d="M26,23H6c-.55,0-1-.45-1-1s.45-1,1-1h20c.55,0,1,.45,1,1s-.45,1-1,1Z"/>
            </svg>
    );
};