import { ArrowRightIcon } from "@/app/components/icons";

import './SettingListSecondary.scss'

type Props = {
    title: string;
    text?: string;
    onClick: () => void;
};

export const SettingListSecondary=({ title, text,  onClick }: Props) => {
    return (
        <button
            type="button"
            className="setting-list-secondary padding-sm-lg bg-color-primary text-color-primary"
            onClick={onClick}
        >
            <div className="setting-list-secondary__wrapper">
                <div className="setting-list-secondary__title">{title}</div>
                <div className="setting-list-secondary__text">{text}</div>
            </div>

            <ArrowRightIcon className="icon-color-primary" />

        </button>
        )
    }   