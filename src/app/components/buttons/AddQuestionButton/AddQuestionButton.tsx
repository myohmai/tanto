import { PlusIcon } from "@/app/components/icons";
import './AddQuestionButton.scss'

type Props = {
    onClick: () => void;
}

export const AddQuestionButton = ({ onClick }: Props ) => {
    return (
        <button type="button" className="add-question-button" onClick={onClick} aria-label="add">
            <PlusIcon size="lg" className="add-question-button__icon" />
        </button>
    );
}