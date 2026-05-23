'use client';
import { LinkIcon,MoodIcon } from '@/app/components/icons'
import { SubmitButton } from '@/app/components/buttons/SubmitButton'
import { BottomSheet } from '@/app/components/menu/BottomSheet'

import type { TurnTableData } from '@/app/types/turntable';
import type { TurnTableMetadata } from '@/app/api/turntable/metadata/route';

import { useTranslations } from 'next-intl'
import { nanoid } from 'nanoid';
import { useState } from 'react'

import './AddTurnTable.scss'

type Props = {
    roomId: string;
    onSubmit: (data: TurnTableData) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const AddTurnTable = ({ roomId, onSubmit, isOpen, onClose } : Props ) => {
    const t = useTranslations('media');
    const tc = useTranslations('common');
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!value || error) return;
        setLoading(true);
        try {
            const res = await fetch('/api/turntable/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: value }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                setError(json.error ?? t('fetchFailed'));
                return;
            }
            const meta: TurnTableMetadata = await res.json();
            const data: TurnTableData = meta.type === 'video'
                ? { id: nanoid(), roomId, type: 'video', video: { videoId: meta.videoId, title: meta.title, channelName: meta.channelName, url: meta.url } }
                : { id: nanoid(), roomId, type: 'music', music: { title: meta.title, artist: meta.artist, cover: meta.cover, service: meta.service, url: meta.url } };
            onSubmit(data);
        } catch (e) {
            console.error(e);
            setError(t('fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    const validUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname
            return hostname.includes('youtube.com') || hostname === 'youtu.be'
        } catch {
            return false
        }
    }
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName='add-turn-table stack-lg'>
            <div className="add-turn-table__title text-color-primary inline-md">
                <MoodIcon variant='line' className='icon-color-primary' />
                <span>{t('addTurnTable')}</span>
            </div>
            <div className="add-turn-table__container stack-md">
                <div className="add-turn-table__sub-title inline-sm text-color-primary">
                    <LinkIcon className='icon-color-primary add-turn-table__sub-title--icon' />
                    <span>{t('pasteYoutubeLink')}</span>
                </div>
                <div className="input-box">
                    <input
                    type="url"
                    required
                    className='add-turn-table__text-area  padding-sm-md text-color-primary bg-color-primary'
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={value}
                    onChange={(e) => {
                        const next = e.target.value
                        setValue(next)

                        if (!next) {
                            setError('')
                            return
                        }
                        if (!validUrl(next)) {
                            setError(t('youtubeOnly'))
                            return
                        }
                        setError('')
                    }}
                    />
                    {error && (
                        <p className="input-box__error">{error}</p>
                        )}
                </div>
            </div>
            <SubmitButton
                label={loading ? tc('loading') : t('submit')}
                onClick={handleSubmit}
                disabled={!value || !!error || loading}
            />
        </BottomSheet>
    )
}