import { EditIcon } from "@/app/components/icons";
import './EditSalonIconButton.scss'

type Props = {
    onClick: () => void;
}

export const EditSalonIconButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="edit-salon-icon-button padding-xs-sm inline-xs" aria-label="Select Salon Icon">
            <EditIcon size="sm" className="edit-salon-icon-button__icon" />
            <span className="edit-salon-icon-button__label">Edit Salon Icon</span>
        </button>
    );
}