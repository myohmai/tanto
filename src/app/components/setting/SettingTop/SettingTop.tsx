import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { SettingList } from "@/app/components/setting/SettingList";
import { SettingIcon } from "@/app/components/icons";
import { AccountIcon } from "@/app/components/icons";
import { LightIcon } from "@/app/components/icons";
import { ProhibitedIcon } from "@/app/components/icons";
import { LogOutButton } from "@/app/components/buttons/LogOutButton";

import './SettingTop.scss'


type Props = {
    onBack: () => void;
    onAccount: () => void;
    onTheme: () => void;
    onMute: () => void;
    onLogout: () => void;
}

export const SettingTop = ({ onBack, onAccount, onTheme, onMute, onLogout }: Props) => {
    return (
        <div className="setting-top bg-color-primary">
            <div className="setting-top__wrapper">
                <SettingTopBar
                    title="Settings"
                    icon={<SettingIcon className="icon-color-primary" />}
                    onBack={onBack}
                />
                <SettingList
                    title="Account"
                    icon={<AccountIcon className="icon-color-primary" />}
                    onClick={onAccount}
                /> 
                <SettingList
                    title="Theme"
                    icon={<LightIcon className="icon-color-primary" />}
                    onClick={onTheme}
                />
                <SettingList
                    title="Mute / Block"
                    icon={<ProhibitedIcon className="icon-color-primary" />}
                    onClick={onMute}
                />
            </div>
            <div className="setting-top__logout">
                <LogOutButton onClick={onLogout} />
            </div>
    </div>
    )
}