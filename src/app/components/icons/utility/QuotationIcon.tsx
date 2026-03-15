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

export const QuotationIcon = ({ size = 'md', className = '' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
                <path d="M10,7h-1c-2.76,0-5,2.24-5,5v1c0,2.76,2.24,5.03,4.95,4.94-.14,1.24-1.29,3.22-2.33,4.67l-.15.21c-.39.54-.34,1.26.12,1.75.27.29.63.44,1,.44.25,0,.5-.07.73-.21,3.81-2.38,6.68-7.25,6.68-11.32v-1.46c0-2.76-2.24-5-5-5Z"/>
                <path d="M23,7h-1c-2.76,0-5,2.24-5,5v1c0,2.76,2.24,5.03,4.95,4.94-.14,1.24-1.29,3.22-2.33,4.67l-.15.21c-.39.54-.34,1.26.12,1.75.27.29.63.44,1,.44.25,0,.5-.07.73-.21,3.81-2.38,6.68-7.25,6.68-11.32v-1.46c0-2.76-2.24-5-5-5Z"/>
            </svg>
    );
};