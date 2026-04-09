import './TabButton.scss';

type Props = {
    label: string;
    isSelected: boolean;
    onSelect: (value: string) => void;
}

export const TabButton = ({ label, isSelected, onSelect }: Props) => {
    return (
        <button className={`tab-button bg-color-primary ${isSelected ? 'is-selected' : ''}`} onClick={() => onSelect(label)}>
            <div className="tab-button__label text-color-primary">{label}</div>
        </button>
    );
}