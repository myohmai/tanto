

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const UserBlockIcon = ({ size = 'md', className = '' }: Props) => {
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
                <path d="M16,23c0-1.58.46-3.11,1.34-4.43l1.01-1.51-2-.05c-.11,0-.23-.01-.35-.01-4.12,0-7.59,1.34-9.78,2.46-1.99,1.02-3.22,3.05-3.22,5.32v1.72c0,.83.67,1.5,1.5,1.5h13.06l-.72-1.45c-.56-1.12-.84-2.32-.84-3.55Z"/>
                <path d="M24,17c-3.31,0-6,2.69-6,6s2.69,6,6,6,6-2.69,6-6-2.69-6-6-6ZM24,19c.74,0,1.42.22,2.02.57l-5.45,5.45c-.35-.59-.57-1.28-.57-2.02,0-2.21,1.79-4,4-4ZM24,27c-.74,0-1.42-.22-2.02-.57l5.45-5.45c.35.59.57,1.28.57,2.02,0,2.21-1.79,4-4,4Z"/>
            </svg>
    );
};