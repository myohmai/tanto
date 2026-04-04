

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

export const MessageIcon = ({ size = 'md', className = '', variant = 'line' }: Props) => {
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
                    ? <g><path d="M16,18.68l13.78-11.81c-.45-1.1-1.52-1.87-2.78-1.87H5c-1.26,0-2.33.78-2.78,1.87l13.78,11.81Z"/><path d="M17.3,20.2c-.38.32-.84.48-1.3.48-.46,0-.92-.16-1.3-.48L2,9.32v14.68c0,1.65,1.35,3,3,3h22c1.65,0,3-1.35,3-3v-14.68l-12.7,10.88Z"/></g>
                    : <path d="M27,5H5c-1.65,0-3,1.35-3,3v16c0,1.65,1.35,3,3,3h22c1.65,0,3-1.35,3-3V8c0-1.65-1.35-3-3-3ZM5,7h22c.55,0,1,.45,1,1v.4l-12,10.29L4,8.4v-.4c0-.55.45-1,1-1ZM27,25H5c-.55,0-1-.45-1-1v-12.97l10.7,9.17c.38.32.84.48,1.3.48s.92-.16,1.3-.48l10.7-9.17v12.97c0,.55-.45,1-1,1Z"/>
                    }
            </svg>
    );
};