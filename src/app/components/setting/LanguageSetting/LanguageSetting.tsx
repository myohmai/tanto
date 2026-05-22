import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingSelect } from "@/app/components/setting/SettingSelect";

import { useState } from "react";

import './LanguageSetting.scss'

type Props = {
    onBack: () => void;
    onTheme: (value: string) => void;
}

export const LanguageSetting = ({ onBack, onTheme }: Props) => {
    const [selected, setSelected] = useState<string | null>(null);

    const select = (value: string) => {
        setSelected(value);
        onTheme(value);
    };

    return (
        <div className="language-setting bg-color-primary">
            <SettingTopBar
                title="Language"
                onBack={onBack}
            />
            <div className="language-setting__wrapper">
                <SettingSelect
                    label="English"
                    value="English"
                    isSelected={selected === 'English'}
                    onSelect={() => select('English')}
                />
                <SettingSelect
                    label="Japanese"
                    value="Japanese"
                    isSelected={selected === 'Japanese'}
                    onSelect={() => select('Japanese')}
                />
            </div>
        </div>
    )
}