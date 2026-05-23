'use client';
import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { useTranslations } from 'next-intl';
import { useState } from "react";

import './EmailSetting.scss'

type Props = {
    recentEmail: string;
    onBack: () => void;
    onSubmit: (value: string) => void;
}

export const EmailSetting = ({ recentEmail, onBack, onSubmit }: Props) => {
    const t = useTranslations('settings');
    const tCommon = useTranslations('common');
    const [value, setValue] = useState("");

    return (
        <div className="email-setting bg-color-primary text-color-primary">
            <SettingTopBar
                title={t('email')}
                onBack={onBack}
            />
            <div className="email-setting__wrapper">
                <div className="email-setting__current">
                    <span>{t('currentEmail')} :</span>
                    <span className="email-setting__email">{recentEmail}</span>
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">{t('newEmail')}</div>
                        <input
                            className="input-box__text-box"
                            type="email"
                            placeholder="user@email.com"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                    </div>
                </div>
                <SubmitButton label={tCommon('confirm')} onClick={() => onSubmit(value)} />
            </div>
        </div>
    );
}
