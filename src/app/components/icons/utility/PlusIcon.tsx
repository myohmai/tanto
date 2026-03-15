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

export const PlusIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M16,2c-7.72,0-14,6.28-14,14s6.28,14,14,14,14-6.28,14-14S23.72,2,16,2ZM22,17h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2Z"/>
            </svg>
    );
};