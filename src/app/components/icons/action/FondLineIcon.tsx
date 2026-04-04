
const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const FondLineIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M16,29c-1.88,0-14-6.44-14-17C2,7.65,5.21,3,10,3c3.11,0,4.98,1.42,6,2.98,1.02-1.57,2.89-2.98,6-2.98,4.79,0,8,4.65,8,9,0,10.56-12.12,17-14,17ZM16.05,27h0,0ZM10,5c-3.54,0-6,3.69-6,7,0,9.07,10.36,14.67,12,14.99,1.64-.33,12-5.93,12-14.99,0-3.31-2.46-7-6-7-4.71,0-5,4.03-5,4.07,0,.55-.45,1-1,1s-1-.45-1-1c0-.04-.29-4.07-5-4.07Z"/>
            </svg>
    );
};