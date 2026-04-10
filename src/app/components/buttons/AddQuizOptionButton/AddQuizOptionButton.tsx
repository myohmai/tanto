import { PlusIcon } from "@/app/components/icons";
import './AddQuizOptionButton.scss'

type Props = {
    onClick: () => void;
}

export const AddQuizOptionButton = ({ onClick }: Props ) => {
    return (
        <button type="button" className="add-quiz-option-button" onClick={onClick} aria-label="add">
            <PlusIcon size="lg" className="add-quiz-option-button__icon" />
        </button>
    );
}