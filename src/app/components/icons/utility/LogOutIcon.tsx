

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const LogOutIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M29,16c0-.34-.18-.63-.45-.81-.06-.09-.12-.17-.2-.25l-4.94-4.94c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l3.59,3.59h-13.59c-.55,0-1,.45-1,1s.45,1,1,1h13.59l-3.59,3.59c-.39.39-.39,1.02,0,1.41.2.2.45.29.71.29s.51-.1.71-.29l4.94-4.94c.08-.08.14-.16.2-.25.26-.18.45-.47.45-.81Z"/>
            <path d="M19,22c-.55,0-1,.45-1,1v3c0,.55-.45,1-1,1H6c-.55,0-1-.45-1-1V6c0-.55.45-1,1-1h11c.55,0,1,.45,1,1v3.07c0,.55.45,1,1,1s1-.45,1-1v-3.07c0-1.65-1.35-3-3-3H6c-1.65,0-3,1.35-3,3v20c0,1.65,1.35,3,3,3h11c1.65,0,3-1.35,3-3v-3c0-.55-.45-1-1-1Z"/>
            </svg>
    );
};