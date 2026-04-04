

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const AddIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M26,15h-9V6c0-.55-.45-1-1-1s-1,.45-1,1v9H6c-.55,0-1,.45-1,1s.45,1,1,1h9v9c0,.55.45,1,1,1s1-.45,1-1v-9h9c.55,0,1-.45,1-1s-.45-1-1-1Z"/>
            </svg>
    );
};