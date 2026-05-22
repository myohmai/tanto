import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingSelect } from "@/app/components/setting/SettingSelect";
import { LightIcon, DarkIcon } from "@/app/components/icons";

import { useState } from "react";



import './ThemeSetting.scss'

type Props = {
    onBack: () => void;
    onTheme: (value: string) => void;
}

export const ThemeSetting = ({ onBack, onTheme }: Props) => {
    const [selected, setSelected] = useState<string | null>(null);

    const select = (value: string) => {
        setSelected(value);
        onTheme(value);
    };

    return (
        <div className="theme-setting bg-color-primary">
            <SettingTopBar
                title="Theme"
                onBack={onBack}
            />
            <div className="theme-setting__wrapper">
                <SettingSelect
                    label="Light"
                    value="light"
                    icon={<LightIcon className="icon-color-primary" />}
                    isSelected={selected === 'light'}
                    onSelect={() => select('light')}
                />
                <SettingSelect
                    label="Dark"
                    value="dark"
                    icon={<DarkIcon className="icon-color-primary" />}
                    isSelected={selected === 'dark'}
                    onSelect={() => select('dark')}
                />
                <SettingSelect
                    label="System"
                    value="system"
                    isSelected={selected === 'system'}
                    onSelect={() => select('system')}
                />
            
            </div>
        </div>
    )
}