import { InfoIcon } from "@/app/components/icons";
import "./Notification.scss";

export type NotificationType =
    | 'specific'
    | 'uncomfortable'
    | 'divided'
    | 'unreliable'
    | 'sensitive'
    | 'adult';

export type NotificationMessage = {
    id: NotificationType;
    message: {
        en: string;
        ja: string;
    };
};

export const notification: NotificationMessage[] = [
    {
        id: 'specific',
        message: {
            en: 'This seems to be causing discomfort to a specific group of users',
            ja: '一部のユーザー層に不快感を与えているようです',
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
    {
        id: 'sensitive',
        message: {
            en: 'Please be mindful of how this information is handled',
            ja: '情報の取り扱いにご注意ください',
        },
    },
    {
        id: 'adult',
        message: {
            en: 'This content may be intended for adult audiences',
            ja: 'アダルトコンテンツの可能性があります',
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