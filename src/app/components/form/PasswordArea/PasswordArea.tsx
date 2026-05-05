import { EyeIcon } from "@/app/components/icons";

import './PasswordArea.scss'

type PasswordLabel = "Password" | "Confirm"

type Props = {
    label: PasswordLabel;
    error?: string;
    isVisible: boolean;
    onVisible: () => void;
    onChange: (value: string) => void;
    }

export const PasswordArea = ({ label, error, isVisible, onVisible, onChange }: Props ) => {
    return (
        <div className="password-box">
            <div className="password-box__container">
                <div className="password-box__label">{label}</div>
                <div className="password-box__inner-container">
                    <input
                        type={isVisible ? "text" : "password"}
                        maxLength={30}
                        className="password-box__text-box"
                        onChange={
                            (e) => {onChange(e.target.value)}
                        }
                    />
                    <button type="button" className="password-box__button" onClick={onVisible}><EyeIcon variant={isVisible ? "inactive" : "active"} className="icon-color-primary" /></button>
                </div>
            </div>
            {error && (<div className="input-box__error">{error}</div>)}
        </div>
    )
}