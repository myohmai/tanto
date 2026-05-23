"use client";
import { GlossCancelButton } from "@/app/components/buttons/GlossCancelButton";
import { GlossDraftButton } from "@/app/components/buttons/GlossDraftButton";
import { useTranslations } from 'next-intl';

import './PostMenuBar.scss'

type Props = {
    type: 'new' | 'reply';
    onCancel: () => void;
    onDraft: () => void;
}

export const PostMenuBar = ({ type, onCancel, onDraft }: Props) => {
    const t = useTranslations('gloss');
    const isNew = type == 'new';
    return (
        <div className="post-menu-bar padding-sm-lg text-color-primary bg-color-primary">
            <GlossCancelButton onClick={onCancel} />
            <span>{isNew ? t('newGloss') : t('replyGloss')}</span>
            <GlossDraftButton onClick={onDraft} />
        </div>
    )
}