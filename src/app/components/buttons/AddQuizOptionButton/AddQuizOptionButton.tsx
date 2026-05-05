import { PlusIcon } from "@/app/components/icons";
import './AddQuizOptionButton.scss'

type Props = {
    onClick: () => void;
    className?: string;
}

export const AddQuizOptionButton = ({ onClick, className }: Props ) => {
    return (
        <button type="button" className={`add-quiz-option-button ${className || ""}`} onClick={onClick} aria-label="add">
            <PlusIcon size="lg" className="add-quiz-option-button__icon" />
        </button>
    );
}