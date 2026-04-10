import './WhisperButton.scss';

type Props = {
    onClick: () => void;
}

export const WhisperButton = ({ onClick }: Props) => {
    return (
        <button type="button" className="whisper-button padding-xs-md" onClick={onClick}>
            Whisper
        </button>
    );
}