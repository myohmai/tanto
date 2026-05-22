import { SettingTopBar } from "@/app/components/setting/SettingTopBar";
import { AccountIcon } from "@/app/components/icons";
import { SettingListSecondary } from "@/app/components/setting/SettingListSecondary";
import { DeleteButton } from "@/app/components/buttons/DeleteButton";

import './AcountSetting.scss'

type Props = {
    onBack: () => void;
    onEmail: () => void;
    recentEmail: string;
    onPassword: () => void;
    onConnected: ()=> void;
    connectedAccount: string;
    onLangage: () => void;
    recentLangage: string;
    onDelete: () => void;
}

export const AccountSetting = ({ onBack, onEmail, recentEmail, onPassword, onConnected, connectedAccount, onLangage, recentLangage, onDelete }: Props) => {
    return (
        <div className="account-setting bg-color-primary">
            <div className="account-setting__wrapper">
                <SettingTopBar
                    title="Account"
                    icon={<AccountIcon className="icon-color-primary" />}
                    onBack={onBack}
                />
                <SettingListSecondary
                    title="Email"
                    text={recentEmail}
                    onClick={onEmail}
                />
                <SettingListSecondary
                    title="Password"
                    onClick={onPassword}
                />
                <SettingListSecondary
                    title="Connected"
                    text={connectedAccount}
                    onClick={onConnected}
                />
                <SettingListSecondary
                    title="Language"
                    text={recentLangage}
                    onClick={onLangage}
                />

            </div>
            <div className="account-setting__delete">
                <DeleteButton label="Delete Account" onClick={onDelete} />
            </div>
        </div>
    )
}
    