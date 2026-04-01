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

export const ProhibitedIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M25.43,7.08c-.05-.11-.11-.22-.2-.31s-.2-.16-.31-.2c-2.33-2.2-5.47-3.57-8.92-3.57-7.17,0-13,5.83-13,13,0,3.58,1.45,6.82,3.8,9.17,0,0,0,.01.01.02s.01,0,.02.01c2.35,2.34,5.6,3.8,9.17,3.8,7.17,0,13-5.83,13-13,0-3.45-1.36-6.59-3.57-8.92ZM16,5c2.67,0,5.13.96,7.03,2.55l-15.48,15.48c-1.59-1.91-2.55-4.36-2.55-7.03,0-6.07,4.93-11,11-11ZM16,27c-2.67,0-5.13-.96-7.03-2.55l15.48-15.48c1.59,1.91,2.55,4.36,2.55,7.03,0,6.07-4.93,11-11,11Z"/>
            </svg>
    );
};