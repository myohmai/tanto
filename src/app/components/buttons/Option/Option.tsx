import { CheckIcon } from "@/app/components/icons";
import './Option.scss';

type Props = {
    label: string;
    isSelected: boolean;
    onSelect: (value: string) => void;
}

export const Option = ({ label, isSelected, onSelect }: Props) => {
    return (
        <button className={`option padding-sm text-color-primary ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(label)}>
            <span>{label}</span>
            {isSelected && <CheckIcon size="md" className="option__icon" />}
        </button>
    );
}