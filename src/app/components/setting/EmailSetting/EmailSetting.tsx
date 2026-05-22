import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { useState } from "react";

import './EmailSetting.scss'

type Props = {
    recentEmail: string;
    onBack: () => void;
    onSubmit: (value: string) => void;
}

export const EmailSetting = ({ recentEmail, onBack, onSubmit }: Props) => {
    const [value, setValue] = useState("");

    return (
        <div className="email-setting bg-color-primary text-color-primary ">
            <SettingTopBar
                title="Email"
                onBack={onBack}
            />
            <div className="email-setting__wrapper">
                <div className="email-setting__current">
                    <span>
                        Current :
                    </span>
                    <span className="email-setting__email">
                        {recentEmail}
                    </span>
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">
                            New Email
                        </div>
                        <input 
                            className="input-box__text-box"
                            type="email"
                            placeholder="user@email.com"
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            value={value}
                        />
                    </div>
                </div>
                <SubmitButton label="Confirm" onClick={() => onSubmit(value)} />
            </div>
        </div>
    )
}