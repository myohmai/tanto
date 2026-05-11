import { TrashIcon } from "@/app/components/icons";
import './DeleteButton.scss'

type Props = {
    label: string;
    onClick: () => void;
}

export const DeleteButton = ({ label, onClick }: Props ) => {
    return(
        <button type="button" onClick={onClick} className="delete-button padding-sm-lg inline-md">
            <TrashIcon className="delete-button__icon"/>
            <span>{label}</span>
        </button>
    )
}