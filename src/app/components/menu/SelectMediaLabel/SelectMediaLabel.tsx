'use client';
import { Option } from '@/app/components/buttons/Option'
import { SubmitButton } from '@/app/components/buttons/SubmitButton'
import { MediaLabelType } from '@/app/components/media/MediaLabel'
import { MediaLabelDescription } from '@/app/components/media/MediaLabelDescription'
import { BottomSheet } from '@/app/components/menu/BottomSheet'
import { useTranslations } from 'next-intl'

import { useState } from 'react';

import './SelectMediaLabel.scss'

type Props = {
    onSubmit: (value: MediaLabelType) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const SelectMediaLabel = ({ onSubmit, isOpen, onClose } : Props ) => {
    const t = useTranslations('media');
    const [selected, setSelected] = useState<MediaLabelType | null>(null);
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName='select-media-label stack-md'>
            <div className="select-media-label__title">{t('selectMediaLabel')}</div>
            <div className="stack-sm">
                <Option<MediaLabelType> label={t('fanArt')} value="fanArt" isSelected={selected === "fanArt"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label={t('official')} value="official" isSelected={selected === "official"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label={t('original')} value="original" isSelected={selected === "original"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label={t('quote')} value="quote" isSelected={selected === "quote"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label={t('ai')} value="ai" isSelected={selected === "ai"} onSelect={(value) => setSelected(value)}/>
            </div>
            {selected && (<MediaLabelDescription type={selected} />)}
            <SubmitButton
                label={t('submit')}
                onClick={() => {
                    if (!selected) return;
                    onSubmit(selected);
                }}
                disabled={!selected}
            />
        </BottomSheet>
    )
}
