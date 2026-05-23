'use client';
import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { PasswordArea } from "@/app/components/form/PasswordArea";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { useTranslations } from 'next-intl';
import { useState } from "react";

import './PasswordSetting.scss'

type Props = {
    onBack: () => void;
    onSubmit: (value: string) => void;
}

export const PasswordSetting = ({ onBack, onSubmit }: Props) => {
    const t = useTranslations('settings');
    const tCommon = useTranslations('common');
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const validatePassword = (value: string): string | undefined => {
        if (value.length < 8) return t('passwordMinLength');
        if (!/[a-z]/.test(value)) return t('passwordLowercase');
        if (!/[A-Z]/.test(value)) return t('passwordUppercase');
        if (!/[0-9]/.test(value)) return t('passwordNumber');
        return undefined;
    };

    const passwordError = password ? validatePassword(password) : undefined;
    const confirmError = confirm && password !== confirm ? t('passwordMismatch') : undefined;

    return (
        <div className="password-setting bg-color-primary">
            <SettingTopBar
                title={t('password')}
                onBack={onBack}
            />
            <div className="password-setting__wrapper">
                <PasswordArea label={t('password')} isVisible={isVisible} onVisible={() => setIsVisible(!isVisible)} onChange={(value) => setPassword(value)} error={passwordError} />
                <PasswordArea label={tCommon('confirm')} isVisible={isConfirmVisible} onVisible={() => setIsConfirmVisible(!isConfirmVisible)} onChange={(value) => setConfirm(value)} error={confirmError} />
                <SubmitButton label={tCommon('confirm')} onClick={() => onSubmit(password)} />
            </div>
        </div>
    );
}
