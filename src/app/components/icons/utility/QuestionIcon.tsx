

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const QuestionIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <circle cx="16" cy="21.5" r="1.5"/>
                <path d="M16,3c-7.17,0-13,5.83-13,13s5.83,13,13,13,13-5.83,13-13S23.17,3,16,3ZM16,27c-6.07,0-11-4.93-11-11s4.93-11,11-11,11,4.93,11,11-4.93,11-11,11Z"/>
                <path d="M16,9c-1.13,0-2.22.48-2.98,1.33-.66.73-1.02,1.68-1.02,2.67,0,.55.45,1,1,1s1-.45,1-1c0-.49.18-.97.51-1.33.38-.42.92-.67,1.49-.67,1.1,0,2,.9,2,2s-.9,2-2,2c-.55,0-1,.45-1,1v2c0,.55.45,1,1,1s1-.45,1-1v-1.13c1.72-.44,3-2.01,3-3.87,0-2.21-1.79-4-4-4Z"/>
            </svg>
    );
};