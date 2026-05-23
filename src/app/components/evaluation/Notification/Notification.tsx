"use client";
import { InfoIcon } from "@/app/components/icons";
import { useTranslations } from "next-intl";
import "./Notification.scss";

export type NotificationType =
    | 'specific'
    | 'uncomfortable'
    | 'divided'
    | 'unreliable'
    | 'sensitive'
    | 'adult';

type Props = {
    type: NotificationType;
};

export const Notification = ({ type }: Props) => {
    const t = useTranslations('notification');
    return (
        <div className="notification inline-sm text-color-secondary">
            <InfoIcon size="sm" className="notification__icon" />
            <span className="notification__message">{t(type)}</span>
        </div>
    );
};
