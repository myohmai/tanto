import { BookMarkIcon } from "@/app/components/icons";
import './BookMarkButton.scss'

type Props = {
    onToggle: () => void;
    isBookmarked: boolean;
}

export const BookMarkButton = ({ onToggle, isBookmarked }: Props) => {
    return (
        <button type="button" onClick={onToggle} className="bookmark-button">
            {isBookmarked ? <BookMarkIcon size="md" variant="fill" className="icon-color-primary" /> : <BookMarkIcon size="md" variant="line" className="icon-color-primary" />}
        </button>
    );
}