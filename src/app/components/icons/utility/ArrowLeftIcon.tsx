

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const ArrowLeftIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M20.67,6.63l.67.74c.18.21.17.52-.04.71l-8.6,7.74c-.11.1-.11.27,0,.37l8.6,7.74c.21.18.22.5.04.71l-.67.74c-.18.21-.5.22-.71.04l-9.63-8.67c-.44-.4-.44-1.09,0-1.49l9.63-8.67c.21-.18.52-.17.71.04Z"/>
            </svg>
    );
};