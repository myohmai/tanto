import { MenuIcon } from "@/app/components/icons"
import './MenuButton.scss'

type Props = {
    onClick: () => void;
    className?: string;
}

export const MenuButton = ({ onClick, className }: Props) => {
    return (
        <button type="button" onClick={onClick} className={`menu-button ${className}`} aria-label="Menu">
            <MenuIcon size="md" className="icon-color-primary" />
        </button>
    );
}