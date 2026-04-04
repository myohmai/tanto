

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const PersonIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <circle cx="16" cy="10" r="6"/>
                <path d="M25.78,19.46c-2.19-1.12-5.67-2.46-9.78-2.46s-7.59,1.34-9.78,2.46c-1.98,1.02-3.22,3.06-3.22,5.32v1.72c0,.83.67,1.5,1.5,1.5h23c.83,0,1.5-.67,1.5-1.5v-1.72c0-2.26-1.23-4.3-3.22-5.32Z"/>
            </svg>
    );
};