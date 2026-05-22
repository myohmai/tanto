import { ArrowRightIcon } from "@/app/components/icons";

import './SettingList.scss'

type Props = {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
};

export const SettingList=({ title, icon, onClick }: Props) => {
    return (
        <button
            type="button"
            className="setting-list padding-sm-lg bg-color-primary text-color-primary"
            onClick={onClick}
        >
            <div className="setting-list__wrapper">
                <div className="setting-list__icon">
                    {icon}
                </div>
                <div className="setting-list__title">{title}</div>
            </div>

            <ArrowRightIcon className="setting-list__arrow" />

        </button>
    )
}