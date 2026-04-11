import { ArrowLeftIcon } from "@/app/components/icons";
import './BackButton.scss'

type Props = {
    onClick: () => void;
}

export const BackButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="back-button" aria-label="Back">
            <ArrowLeftIcon size="md" className="icon-color-primary" />
        </button>
    );
}