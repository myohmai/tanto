import { MenuIcon } from "@/app/components/icons"
import './MenuButton.scss'

type Props = {
    onClick: () => void;
}

export const MenuButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="menu-button" aria-label="Menu">
            <MenuIcon size="md" className="icon-color-primary" />
        </button>
    );
}