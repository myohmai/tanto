'use client';
import { InfoIcon } from "@/app/components/icons";
import { useTranslations } from "next-intl";
import "./MediaLabelDescription.scss";

import { MediaLabelType } from "@/app/types/media";

type Props = {
    type: MediaLabelType;
    lang?: 'en' | 'ja' | 'ko';
};

export const MediaLabelDescription = ({ type }: Props) => {
    const t = useTranslations('media');
    const key = `${type}Desc` as Parameters<typeof t>[0];
    return (
        <div className="media-label-description inline-sm text-color-secondary">
            <InfoIcon size="sm" className="media-label-description__icon" />
            <span className="media-label-description__message">{t(key)}</span>
        </div>
    );
};
