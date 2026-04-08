import './GlossCancelButton.scss';

type Props = {
    onClick: () => void;
}

export const GlossCancelButton = ({ onClick }: Props) => {
    return (
        <button className="gloss-cancel-button text-color-primary padding-xs-sm" onClick={onClick}>
                Cancel
        </button>
    );
}