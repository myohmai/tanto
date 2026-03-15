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

export const ShareIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M27,19c-.55,0-1,.45-1,1v5c0,.55-.37,1-.83,1H6.83c-.46,0-.83-.45-.83-1v-5c0-.55-.45-1-1-1s-1,.45-1,1v5c0,1.65,1.27,3,2.83,3h18.33c1.56,0,2.83-1.35,2.83-3v-5c0-.55-.45-1-1-1Z"/><path d="M8.71,14.71l6.29-6.29v13.59c0,.55.45,1,1,1s1-.45,1-1v-13.59l6.29,6.29c.2.2.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.02,0-1.41l-8-8c-.09-.09-.2-.17-.33-.22-.24-.1-.52-.1-.76,0-.12.05-.23.12-.33.22l-8,8c-.39.39-.39,1.02,0,1.41s1.02.39,1.41,0Z"/>
            </svg>
    );
};