import { CancelIcon } from "@/app/components/icons";
import './DeleteQuizOptionButton.scss'

type Props = {
    onClick: () => void;
    className?: string;
}

export const DeleteQuizOptionButton = ({ onClick, className }: Props ) => {
    return (
        <button type="button" className={`delete-quiz-option-button ${className || ""}`} onClick={onClick} aria-label="delete">
            <CancelIcon size="lg" className="delete-quiz-option-button__icon" />
        </button>
    );
}