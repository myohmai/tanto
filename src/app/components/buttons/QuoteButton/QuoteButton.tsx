import { QuoteIcon } from "@/app/components/icons"
import './QuoteButton.scss'

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const QuoteButton = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="quote-button">
            <QuoteIcon size="md" className="icon-color-primary" />
        </button>
    );
}