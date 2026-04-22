import './LogoIcon.scss'
export type IconSize = 'lg' | 'md' | 'sm'; 

const sizeMap: Record<IconSize, number> = {
    lg: 32,
    md: 24,
    sm: 16,
};

type Props = {
    size?: IconSize;
    className?: string;
}

export const LogoIcon = ({ size = 'lg', className = 'logo-icon' }: Props) => {
    const px = sizeMap[size];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={px}
            height={px}
            className={className} 
            viewBox="0 0 32 32"
            fill="currentColor">
            <path d="M9.424 18.8039C9.929 14.269 12.07 10.324 15.453 7.69608C15.811 7.41808 16.23 7.14009 16.678 6.85309C16.079 6.0911 15.383 5.39112 14.583 4.77013C13.327 3.79414 10.147 2.24217 9.184 0.430195C8.916 -0.0737973 8.223 -0.152796 7.861 0.288197C2.629 6.6461 2.458 16.5319 8.927 21.7409C9.068 21.8539 9.208 21.9649 9.349 22.0739C9.282 20.9799 9.304 19.8849 9.424 18.8049V18.8039Z"/>
            <path d="M23.073 27.1937C20.783 29.0377 18.479 30.2827 17.685 31.6177C17.403 32.0907 16.727 32.1307 16.377 31.7047C11.125 25.3248 10.985 15.2189 17.416 10.223C18.672 9.24702 21.852 7.69505 22.815 5.88308C23.083 5.37908 23.776 5.30008 24.138 5.74108C29.37 12.099 29.541 21.9848 23.072 27.1937H23.073Z"/>
            </svg>
    );
};