

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const HostIcon = ({ size = 'md', className = '' }: Props) => {
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
                <path d="M27.5,28c.83,0,1.5-.67,1.5-1.5v-3.26l-4.76,4.76h3.26Z"/>
                <path d="M13.88,24.12c-.57-.57-.88-1.32-.88-2.12s.31-1.55.88-2.12c.57-.57,1.32-.88,2.12-.88s1.55.31,2.12.88l2.88,2.88,3.81-3.81-1.45-.55c-2.45-.93-4.93-1.4-7.36-1.4-4.12,0-7.59,1.34-9.78,2.46-1.99,1.02-3.22,3.05-3.22,5.32v1.72c0,.83.67,1.5,1.5,1.5h13.26l-3.88-3.88h0Z"/>
                <path d="M29.17,18.83c-.39-.39-1.02-.39-1.41,0l-6.76,6.76-4.29-4.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l5,5c.2.2.45.29.71.29s.51-.1.71-.29l7.47-7.47c.39-.39.39-1.02,0-1.41Z"/>
            </svg>
    );
};