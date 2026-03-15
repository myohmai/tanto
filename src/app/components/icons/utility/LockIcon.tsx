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

export const LockIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M24,14.18v-3.18c0-4.41-3.59-8-8-8s-8,3.59-8,8v3.18c-1.16.41-2,1.51-2,2.82v9c0,1.65,1.35,3,3,3h14c1.65,0,3-1.35,3-3v-9c0-1.3-.84-2.4-2-2.82ZM17,21.72v2.88c0,.22-.18.4-.4.4h-1.2c-.22,0-.4-.18-.4-.4v-2.88c-.6-.35-1-.98-1-1.72,0-1.1.9-2,2-2s2,.9,2,2c0,.74-.4,1.38-1,1.72ZM22,14h-12v-3c0-3.31,2.69-6,6-6s6,2.69,6,6v3Z"/>
            </svg>
    );
};