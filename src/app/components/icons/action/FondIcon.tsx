import { useId } from 'react';
type IconSize = 'lg' | 'md' | 'sm'; 

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    color?: string;
    className?: string;
};

export const FondIcon = ({ size = 'md', color = '#d68c9a', className }: Props) => {
    const iconSize = sizeMap[size];
    const id = useId();
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            className={className}
            viewBox="0 0 32 32">
            <defs>
                <radialGradient id={`${id}__gradient`} cx="26.14" cy="21.37" fx="26.14" fy="21.37" r="27.56" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor={color} stopOpacity=".8"/>
                    <stop offset="1" stopColor={color} stopOpacity=".05"/>
                </radialGradient>
                <radialGradient id={`${id}__gradient-white`}  cx="8.58" cy="9.9" fx="8.58" fy="9.9" r="19.62" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff" stopOpacity=".4"/>
                    <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id={`${id}__gradient-linear`} x1="7.16" y1="4.26" x2="24.84" y2="21.93" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff" stopOpacity=".8"/>
                    <stop offset=".05" stopColor="#fff" stopOpacity=".79"/>
                    <stop offset=".08" stopColor="#fff" stopOpacity=".76"/>
                    <stop offset=".1" stopColor="#fff" stopOpacity=".7"/>
                    <stop offset=".13" stopColor="#fff" stopOpacity=".62"/>
                    <stop offset=".15" stopColor="#fff" stopOpacity=".52"/>
                    <stop offset=".16" stopColor="#fff" stopOpacity=".39"/>
                    <stop offset=".18" stopColor="#fff" stopOpacity=".24"/>
                    <stop offset=".2" stopColor="#fff" stopOpacity=".07"/>
                    <stop offset=".2" stopColor="#fff" stopOpacity=".05"/>
                    <stop offset=".8" stopColor="#fff" stopOpacity=".05"/>
                    <stop offset=".81" stopColor="#fff" stopOpacity=".09"/>
                    <stop offset=".83" stopColor="#fff" stopOpacity=".22"/>
                    <stop offset=".85" stopColor="#fff" stopOpacity=".32"/>
                    <stop offset=".88" stopColor="#fff" stopOpacity=".4"/>
                    <stop offset=".91" stopColor="#fff" stopOpacity=".46"/>
                    <stop offset=".94" stopColor="#fff" stopOpacity=".49"/>
                    <stop offset="1" stopColor="#fff" stopOpacity=".5"/>
                </linearGradient>
            </defs>
            <g>
                <path className="fond__base" fill={color} d="M22,3c-3.11,0-4.98,1.42-6,2.98-1.02-1.57-2.89-2.98-6-2.98C5.21,3,2,7.65,2,12c0,10.56,12.12,17,14,17s14-6.44,14-17c0-4.35-3.21-9-8-9Z"/>
                <path fill={`url(#${id}__gradient)`} d="M22,3c-3.11,0-4.98,1.42-6,2.98-1.02-1.57-2.89-2.98-6-2.98C5.21,3,2,7.65,2,12c0,10.56,12.12,17,14,17s14-6.44,14-17c0-4.35-3.21-9-8-9Z"/>
                <path fill={`url(#${id}__gradient-white)`} d="M22,3c-3.11,0-4.98,1.42-6,2.98-1.02-1.57-2.89-2.98-6-2.98C5.21,3,2,7.65,2,12c0,10.56,12.12,17,14,17s14-6.44,14-17c0-4.35-3.21-9-8-9Z"/>
                <path fill={`url(#${id}__gradient-linear)`} d="M22,5c3.59,0,6,3.62,6,7,0,9.01-10.53,14.76-12,15-1.48-.24-12-5.99-12-15,0-3.38,2.41-7,6-7,1.98,0,3.43.7,4.32,2.07l.84,1.3.84,1.3.84-1.3.84-1.3c.89-1.37,2.34-2.07,4.32-2.07M22,4c-2.91,0-4.41,1.37-5.16,2.53l-.84,1.3-.84-1.3c-.75-1.15-2<|fim_middle|>.25-2.53-5.16-2.53-3.54,0-6,3.69-6,7,0,9.07,10.36,14.67,12,14.99,1.64-.33,12-5.93,12-14.99,0-3.31-2.46-7-6-7Z"/>
            </g>
        </svg>
    );
};