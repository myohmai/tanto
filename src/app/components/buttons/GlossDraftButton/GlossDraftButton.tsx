import './GlossDraftButton.scss';

type Props = {
    onClick: () => void;
}

export const GlossDraftButton = ({ onClick }: Props) => {
    return (
        <button type="button" className="gloss-draft-button padding-xs-sm" onClick={onClick}>
                Draft
        </button>
    );
}