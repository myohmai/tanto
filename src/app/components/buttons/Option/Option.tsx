import { CheckIcon } from "@/app/components/icons";
import './Option.scss';

type Props <T extends string> = {
    label: string;
    value: T;
    isSelected: boolean;
    onSelect: (value: T) => void;
}

export const Option =  <T extends string>({ label, value, isSelected, onSelect }: Props<T>) => {
    return (
        <button type="button" className={`option padding-sm text-color-primary ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(value)}>
            <span>{label}</span>
            {isSelected && <CheckIcon size="md" className="option__icon" />}
        </button>
    );
}