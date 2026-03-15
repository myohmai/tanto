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

export const EditIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M27.41,4.59c-1.5-1.5-3.41-.59-3.41-.59l-1.65,1.65c-.2.2-.2.51,0,.71l3.29,3.29c.2.2.51.2.71,0l1.65-1.65s.91-1.91-.59-3.41Z"/>
            <path d="M21.35,7.35c-.2-.2-.51-.2-.71,0l-14.48,14.48c-.11.11-.19.24-.24.39l-1.61,4.83c-.13.39.24.76.63.63l4.83-1.61c.15-.05.28-.13.39-.24l14.48-14.48c.2-.2.2-.51,0-.71l-3.29-3.29Z"/>
            </svg>
    );
};