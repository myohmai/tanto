import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { PasswordArea } from "@/app/components/form/PasswordArea"
import { SubmitButton } from "@/app/components/buttons/SubmitButton";

import { useState } from "react";


import './PasswordSetting.scss'

type Props = {
    onBack: () => void;
    onSubmit: (value: string) => void;
}

const validatePassword = (value: string): string | undefined => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
    if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
    if (!/[0-9]/.test(value)) return "Password must include a number.";
    return undefined;
};

export const PasswordSetting = ({ onBack, onSubmit }: Props) => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const passwordError = password ? validatePassword(password) : undefined;
    const confirmError = confirm && password !== confirm ? "Passwords do not match." : undefined;

    return (
        <div className="password-setting bg-color-primary">
            <SettingTopBar
                title="Password"
                onBack={onBack}
            />
            <div className="password-setting__wrapper">
                <PasswordArea label="Password" isVisible={isVisible} onVisible={() => setIsVisible(!isVisible)} onChange={(value) => setPassword(value)} error={passwordError} />
                <PasswordArea label="Confirm" isVisible={isConfirmVisible} onVisible={() => setIsConfirmVisible(!isConfirmVisible)} onChange={(value) => setConfirm(value)} error={confirmError} />
                <SubmitButton label="Confirm" onClick={() => onSubmit(password)} />
            </div>
        </div>
    )

}