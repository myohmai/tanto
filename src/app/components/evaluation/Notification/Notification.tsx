import { InfoIcon } from "@/app/components/icons";
import "./Notification.scss";

type NotificationType =
    | 'specific'
    | 'uncomfortable'
    | 'divided'
    | 'unreliable';

type NotificationMessage = {
    id: NotificationType;
    message: {
        en: string;
        ja: string;
    };
};

const notification: NotificationMessage[] = [
    {
        id: 'specific',
        message: {
            en: 'Supported by a specific group of users',
            ja: '一部のユーザー層に支持されています',
        },
    },
    {
        id: 'uncomfortable',
        message: {
            en: 'This may be uncomfortable for some users',
            ja: '不快に感じるユーザーがいるようです',
        },
    },
    {
        id: 'divided',
        message: {
            en: 'Opinions on this are divided',
            ja: '意見が分かれています',
        },
    },
    {
        id: 'unreliable',
        message: {
            en: 'This information is unreliable',
            ja: '不確かな情報です',
        },
    },
];

type Props = {
    type: NotificationType;
    lang: 'en' | 'ja';
};

export const Notification = ({ type, lang }: Props) => {
    const notificationMessage = notification.find((n) => n.id === type)?.message[lang] || '';
    return (
        <div className="notification inline-sm text-color-secondary">
            <InfoIcon size="sm" className="notification__icon" />
            <span className="notification__message">{notificationMessage}</span>
        </div>
    );
};