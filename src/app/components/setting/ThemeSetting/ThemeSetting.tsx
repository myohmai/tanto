'use client';
import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingSelect } from "@/app/components/setting/SettingSelect";
import { LightIcon, DarkIcon } from "@/app/components/icons";
import { useTranslations } from 'next-intl';
import { useState } from "react";

import './ThemeSetting.scss'

type Props = {
    onBack: () => void;
    onTheme: (value: string) => void;
    initialTheme?: string;
}

export const ThemeSetting = ({ onBack, onTheme, initialTheme }: Props) => {
    const t = useTranslations('settings');
    const [selected, setSelected] = useState<string | null>(initialTheme ?? null);

    const select = (value: string) => {
        setSelected(value);
        onTheme(value);
    };

    return (
        <div className="theme-setting bg-color-primary">
            <SettingTopBar
                title={t('theme')}
                onBack={onBack}
            />
            <div className="theme-setting__wrapper">
                <SettingSelect
                    label={t('light')}
                    value="light"
                    icon={<LightIcon className="icon-color-primary" />}
                    isSelected={selected === 'light'}
                    onSelect={() => select('light')}
                />
                <SettingSelect
                    label={t('dark')}
                    value="dark"
                    icon={<DarkIcon className="icon-color-primary" />}
                    isSelected={selected === 'dark'}
                    onSelect={() => select('dark')}
                />
                <SettingSelect
                    label={t('system')}
                    value="system"
                    isSelected={selected === 'system'}
                    onSelect={() => select('system')}
                />
            </div>
        </div>
    );
}
