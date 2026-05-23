'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { LinkIcon } from "@/app/components/icons";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import './MediaEmbedForm.scss'

type Props = {
    onSubmit: (value: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const MediaEmbedForm = ({ onSubmit, isOpen, onClose } : Props) => {
    const t = useTranslations('media');
    const [value, setValue] = useState('')
    const [error,setError] = useState('')

    // const validUrl = (url:string) => {
    //     try {
    //         new URL(url)
    //         return true
    //     } catch {
    //         return false
    //     }
    // }
    const validUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname
            
            return (
                hostname.includes('youtube.com') ||
                hostname === 'youtu.be' ||
                hostname.includes('spotify.com') ||
                hostname.includes('music.apple.com')
            )
        } catch {
            return false
        }
    }
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="media-embed-form stack-lg" >
            <div className="media-embed-form__container stack-md">
                <div className="media-embed-form__title inline-sm text-color-primary">
                    <LinkIcon className="media-embed-form__icon icon-color-primary" />
                    <span>{t('addUrl')}</span>
                </div>
                <div className="input-box">
                    <input
                        type="url"
                        required
                        placeholder="https://"
                        className="media-embed-form__text-area padding-sm-md text-color-primary bg-color-primary"
                        value={value}
                        onChange={(e) => {
                            const next = e.target.value
                            setValue(next)

                            if (!next) {
                                setError('')
                                return
                            }
                            if (!validUrl(next)) {
                                setError(t('urlNotAllowed'))
                                return
                            }
                            setError('')
                        }}
                    />
                    {error &&(<p className="input-box__error">{error}</p>)}
                </div>
            </div>
            <SubmitButton
                label={t('submit')}
                onClick={() => {
                    if (!value || error) return;
                    onSubmit(value);
                    setValue('');
                    setError('');
                    onClose();
                }}
                disabled={!value || !!error}
            />
        </BottomSheet>
    )
}