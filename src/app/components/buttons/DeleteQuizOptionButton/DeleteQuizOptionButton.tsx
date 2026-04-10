import { CancelIcon } from "@/app/components/icons";
import './DeleteQuizOptionButton.scss'

type Props = {
    onClick: () => void;
}

export const DeleteQuizOptionButton = ({ onClick }: Props ) => {
    return (
        <button type="button" className="delete-quiz-option-button" onClick={onClick} aria-label="delete">
            <CancelIcon size="lg" className="delete-quiz-option-button__icon" />
        </button>
    );
}