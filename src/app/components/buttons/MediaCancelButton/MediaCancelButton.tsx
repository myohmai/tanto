import { CancelIcon } from "@/app/components/icons";
import './MediaCancelButton.scss';

type Props = {
    onClick: () => void;
}

export const MediaCancelButton = ({ onClick }: Props) => {
    return (
        <button type="button" className="media-cancel-button" onClick={onClick}>
            <CancelIcon size="lg" className="media-cancel-button__icon" />
        </button>
    );
}