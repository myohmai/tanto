

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
    variant?: 'active' | 'inactive';
}

export const RadioButtonIcon = ({ size = 'md', className = '', variant = 'inactive' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                {variant === 'active'
                    ? <g><path d="M16,2c-7.72,0-14,6.28-14,14s6.28,14,14,14,14-6.28,14-14S23.72,2,16,2ZM16,28c-6.62,0-12-5.38-12-12s5.38-12,12-12,12,5.38,12,12-5.38,12-12,12Z"/><path d="M16,6c-5.51,0-10,4.49-10,10s4.49,10,10,10,10-4.49,10-10-4.49-10-10-10Z"/></g>
                    : <path d="M16,30c-7.72,0-14-6.28-14-14S8.28,2,16,2s14,6.28,14,14-6.28,14-14,14ZM16,4c-6.62,0-12,5.38-12,12s5.38,12,12,12,12-5.38,12-12-5.38-12-12-12Z"/>
                    }
            </svg>
    );
};