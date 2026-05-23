"use client";

import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingSelect } from "@/app/components/setting/SettingSelect";
import { setLocale } from "@/app/actions/locale";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/request";

import { useState } from "react";

import './LanguageSetting.scss'

type Props = {
    onBack: () => void;
}

const LOCALES: { value: Locale; label: string }[] = [
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
];

export const LanguageSetting = ({ onBack }: Props) => {
    const t = useTranslations("language");
    const currentLocale = useLocale() as Locale;
    const [selected, setSelected] = useState<Locale>(currentLocale);

    const handleSelect = async (locale: Locale) => {
        setSelected(locale);
        await setLocale(locale);
        window.location.reload();
    };

    return (
        <div className="language-setting bg-color-primary">
            <SettingTopBar
                title={t("label")}
                onBack={onBack}
            />
            <div className="language-setting__wrapper">
                {LOCALES.map(({ value, label }) => (
                    <SettingSelect
                        key={value}
                        label={label}
                        value={value}
                        isSelected={selected === value}
                        onSelect={() => handleSelect(value)}
                    />
                ))}
            </div>
        </div>
    );
};
