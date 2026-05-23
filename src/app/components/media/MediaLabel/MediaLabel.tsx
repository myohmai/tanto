'use client';
import './MediaLabel.scss'

import { useTranslations } from 'next-intl';
import { MediaLabelType } from '@/app/types/media';

export type Lang = 'en' | 'ja' | 'ko';

type Props = {
    type: MediaLabelType;
    lang?: Lang;
}

export const MediaLabel = ({ type }: Props) => {
    const t = useTranslations('media');
    return (
        <div className={`media-label padding-xs-sm ${type}`}>
            <span>{t(type as Parameters<typeof t>[0])}</span>
        </div>
    );
}
