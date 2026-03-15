type IconSize = 'lg' | 'md' | 'sm';

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
    variant?: 'line' | 'fill';
}

export const HomeIcon = ({ size = 'md', className = '', variant = 'line' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                {variant === 'fill'
                    ? <path d="M26.9,10.62l-9.63-7.88c-.73-.6-1.8-.6-2.53,0l-9.63,7.88c-.7.57-1.1,1.42-1.1,2.32v13.05c0,1.65,1.35,3,3,3h4c1.1,0,2-.9,2-2v-7h6v7c0,1.1.9,2,2,2h4c1.65,0,3-1.35,3-3v-13.05c0-.9-.4-1.75-1.1-2.32Z"/>
                    : <path d="M25,29h-4c-1.1,0-2-.9-2-2v-7h-6v7c0,1.1-.9,2-2,2h-4c-1.65,0-3-1.35-3-3v-13.05c0-.9.4-1.75,1.1-2.32L14.73,2.74c.73-.6,1.8-.6,2.53,0l9.63,7.88c.7.57,1.1,1.42,1.1,2.32v13.05c0,1.65-1.35,3-3,3ZM13,18h6c1.1,0,2,.9,2,2v7h4c.55,0,1-.45,1-1v-13.05c0-.3-.13-.58-.37-.77l-9.63-7.88-9.63,7.88c-.23.19-.37.47-.37.77v13.05c0,.55.45,1,1,1h4v-7c0-1.1.9-2,2-2Z"/>
                    }
            </svg>
    );
};