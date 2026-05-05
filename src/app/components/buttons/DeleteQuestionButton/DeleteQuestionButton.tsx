import { CancelIcon } from "@/app/components/icons";
import './DeleteQuestionButton.scss'

type Props = {
    onClick: () => void;
    className?: string;
}

export const DeleteQuestionButton = ({ onClick, className }: Props ) => {
    return (
    <button type="button" className={`delete-question-button ${className || ''}`} onClick={onClick} aria-label="delete">
            <CancelIcon size="lg" className="delete-question-button__icon" />
        </button>
    );
}