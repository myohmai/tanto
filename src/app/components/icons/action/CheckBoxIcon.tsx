type IconSize = 'lg' | 'md' | 'sm';

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

export const CheckBoxIcon = ({ size = 'md', className = '', variant = 'inactive' }: Props) => {
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
                    ? <path d="M26,3H6c-1.65,0-3,1.35-3,3v20c0,1.65,1.35,3,3,3h20c1.65,0,3-1.35,3-3V6c0-1.65-1.35-3-3-3ZM14.77,21.15l-5.71-5.71,1.41-1.41,4.29,4.29,6.76-6.76,1.41,1.41-8.17,8.17Z"/>
                    : <path d="M26,29H6c-1.65,0-3-1.35-3-3V6c0-1.65,1.35-3,3-3h20c1.65,0,3,1.35,3,3v20c0,1.65-1.35,3-3,3ZM6,5c-.55,0-1,.45-1,1v20c0,.55.45,1,1,1h20c.55,0,1-.45,1-1V6c0-.55-.45-1-1-1H6Z"/>
                    }
            </svg>
    );
};