import { PlusIcon } from "@/app/components/icons";
import './AddQuestionButton.scss'

type Props = {
    onClick: () => void;
    className?: string;
}

export const AddQuestionButton = ({ onClick, className }: Props ) => {
    return (
        <button type="button" className={`add-question-button ${className || ""}`} onClick={onClick} aria-label="add">
            <PlusIcon size="lg" className="add-question-button__icon" />
        </button>
    );
}