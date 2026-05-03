import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { LinkIcon } from "@/app/components/icons";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";

import { useState } from 'react'

import './MediaEmbedForm.scss'

type Props = {
    onSubmit: (value: string) => void;
}

export const MediaEmbedForm = ({ onSubmit } : Props) => {
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
        <BottomSheet contentClassName="media-embed-form stack-lg" >
            <div className="media-embed-form__container stack-md">
                <div className="media-embed-form__title inline-sm text-color-primary">
                    <LinkIcon className="media-embed-form__icon icon-color-primary" />
                    <span>Add URL</span>
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
                                // setError('Please enter a valid URL')
                                setError('Only YouTube / Apple Music / Spotify links allowed')
                                return
                            }
                            setError('')
                        }}
                    />
                    {error &&(<p className="input-box__error">{error}</p>)}
                </div>
            </div>
            <SubmitButton label="Submit" onClick={() => {if(!value || error) return onSubmit(value)}} disabled={!value || !!error} />
        </BottomSheet>
    )
}