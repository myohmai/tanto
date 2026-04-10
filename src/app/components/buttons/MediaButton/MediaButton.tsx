import { MediaIcon } from "@/app/components/icons"
import './MediaButton.scss'

type Props = {
    onClick: () => void;
}

export const MediaButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="media-button">
            <MediaIcon size="lg" className="icon-color-secondary" />
        </button>
    );
}