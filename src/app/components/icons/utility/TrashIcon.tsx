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

export const TrashIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M26,7H6c-.55,0-1,.45-1,1s.45,1,1,1h1v16c0,1.65,1.35,3,3,3h12c1.65,0,3-1.35,3-3V9h1c.55,0,1-.45,1-1s-.45-1-1-1ZM23,25c0,.55-.45,1-1,1h-12c-.55,0-1-.45-1-1V9h14v16Z"/>
                <path d="M12,6h8c.55,0,1-.45,1-1s-.45-1-1-1h-8c-.55,0-1,.45-1,1s.45,1,1,1Z"/>
                <path d="M13,24c.55,0,1-.45,1-1v-11c0-.55-.45-1-1-1s-1,.45-1,1v11c0,.55.45,1,1,1Z"/>
                <path d="M19,24c.55,0,1-.45,1-1v-11c0-.55-.45-1-1-1s-1,.45-1,1v11c0,.55.45,1,1,1Z"/>
            </svg>
    );
};