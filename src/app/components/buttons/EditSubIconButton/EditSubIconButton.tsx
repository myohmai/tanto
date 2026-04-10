import { EditIcon } from "@/app/components/icons";
import './EditSubIconButton.scss'

type Props = {
    onClick: () => void;
}

export const EditSubIconButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="edit-sub-icon-button padding-xs-sm inline-xs" aria-label="Select Sub Icon">
            <EditIcon size="sm" className="edit-sub-icon-button__icon" />
            <span className="edit-sub-icon-button__label">Edit Icon</span>
        </button>
    );
}