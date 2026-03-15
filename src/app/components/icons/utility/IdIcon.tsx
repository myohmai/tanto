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

export const IdIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M22,5h-12c-2.76,0-5,2.24-5,5v12c0,2.76,2.24,5,5,5h12c2.76,0,5-2.24,5-5v-12c0-2.76-2.24-5-5-5ZM25,22c0,1.65-1.35,3-3,3h-12c-1.65,0-3-1.35-3-3v-12c0-1.65,1.35-3,3-3h12c1.65,0,3,1.35,3,3v12Z"/>
                <rect x="19" y="19" width="4" height="4" rx="1" ry="1"/>
                <rect x="19" y="13" width="4" height="4" rx="1" ry="1"/>
            </svg>
    );
};