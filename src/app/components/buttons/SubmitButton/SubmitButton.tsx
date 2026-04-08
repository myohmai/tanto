import './SubmitButton.scss';

type Props = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export const SubmitButton = ({ label, onClick, disabled = false }: Props) => {
    return (
        <button className={`submit-button padding-sm-lg ${disabled ? 'disabled' : ''}`} onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}