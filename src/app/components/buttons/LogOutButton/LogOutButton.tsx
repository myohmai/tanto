import { LogOutIcon } from "@/app/components/icons";
import './LogOutButton.scss';

type Props = {
    onClick: () => void;
}

export const LogOutButton = ({ onClick }: Props ) => {
    return (
        <button type="button" onClick={onClick} className="log-out-button text-color-secondary inline-md padding-xs-md" aria-label="Log out">
            <LogOutIcon size="md" className="icon-color-secondary" />
            <span>Log Out</span>
        </button>
    );
}