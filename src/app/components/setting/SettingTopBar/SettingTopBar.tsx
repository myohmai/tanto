import { BackButton } from '@/app/components/buttons/BackButton';

import './SettingTopBar.scss'

type Props = {
    title: string;
    icon?: React.ReactNode;
    onBack: () => void;
};

export const SettingTopBar=({ title, icon, onBack }: Props) => {
    return (
        <div className="setting-top-bar bg-color-primary text-color-primary padding-sm-md inline-md">
            <BackButton onClick={onBack} />
                <div className="setting-top-bar__icon">
                    {icon}
                </div>
                <div className="setting-top-bar__title">{title}</div>
        </div>
    );
}