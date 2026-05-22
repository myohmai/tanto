import { RadioButtonIcon } from "@/app/components/icons";

import './SettingSelect.scss'

type Props = {
    label: string;
    value: string;
    icon?: React.ReactNode;
    isSelected: boolean;
    onSelect: () => void;
}

export const SettingSelect = ({ label, value, icon, isSelected, onSelect }: Props) => {
    return (
        <button
            type="button"
            className="setting-select bg-color-primary text-color-primary padding-sm-lg"
            onClick={onSelect}
            value={value}
        >
            <RadioButtonIcon variant={isSelected ? "active" : "inactive"} className="setting-select__icon" />
            <div className="setting-select__wrapper">
                {icon}
                <span className="setting-select__label">
                    {label}
                </span>
            </div>
        </button>
    )
}