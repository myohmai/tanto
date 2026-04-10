import { CancelIcon } from "@/app/components/icons";
import './DeleteQuestionButton.scss'

type Props = {
    onClick: () => void;
}

export const DeleteQuestionButton = ({ onClick }: Props ) => {
    return (
        <button type="button" className="delete-question-button" onClick={onClick} aria-label="delete">
            <CancelIcon size="lg" className="delete-question-button__icon" />
        </button>
    );
}