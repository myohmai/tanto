'use client';
import { LinkIcon,MoodIcon } from '@/app/components/icons'
import { SubmitButton } from '@/app/components/buttons/SubmitButton'
import { BottomSheet } from '@/app/components/menu/BottomSheet'

import type { TurnTableData } from '@/app/types/turntable';

import { parseTurnTable } from "@/app/logic/turntable/parser";

import { useState } from 'react'

import './AddTurnTable.scss'

type Props = {
    roomId: string;
    onSubmit: (data: TurnTableData) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const AddTurnTable = ({ roomId, onSubmit, isOpen, onClose } : Props ) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        try {
            if (!value || error) return;

            const data = parseTurnTable(value, roomId);

            onSubmit(data);
        } catch (e) {
            console.error(e);
            setError("Invalid URL");
        }
    };

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
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName='add-turn-table stack-lg'>
            <div className="add-turn-table__title text-color-primary inline-md">
                <MoodIcon variant='line' className='icon-color-primary' />
                <span>Add Turn Table</span>
            </div>
            <div className="add-turn-table__container stack-md">
                <div className="add-turn-table__sub-title inline-sm text-color-primary">
                    <LinkIcon className='icon-color-primary add-turn-table__sub-title--icon' />
                    <span>Paste YouTube / Apple Music / Spotify link</span>
                </div>
                <div className="input-box">
                    <input
                    type="url"
                    required
                    className='add-turn-table__text-area  padding-sm-md text-color-primary bg-color-primary'
                    placeholder="https://" 
                    value={value}
                    onChange={(e) => {
                        const next = e.target.value
                        setValue(next)

                        if (!next) {
                            setError('')
                            return
                        }
                        if (!validUrl(next)) {
                            setError('Only YouTube / Apple Music / Spotify links allowed')
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
                label="Submit"
                onClick={handleSubmit}
                disabled={!value || !!error}
            />
        </BottomSheet>
    )
}