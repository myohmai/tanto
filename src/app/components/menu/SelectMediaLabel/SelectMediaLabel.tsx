'use client';
import { Option } from '@/app/components/buttons/Option'
import { SubmitButton } from '@/app/components/buttons/SubmitButton'
import { MediaLabelType } from '@/app/components/media/MediaLabel'
import { MediaLabelDescription } from '@/app/components/media/MediaLabelDescription'
import { BottomSheet } from '@/app/components/menu/BottomSheet'

import { useState } from 'react';

import './SelectMediaLabel.scss'

type Props = {
    onSubmit: (value: MediaLabelType) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const SelectMediaLabel = ({ onSubmit, isOpen, onClose } : Props ) => {
    const [selected, setSelected] = useState<MediaLabelType | null>(null);
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName='select-media-label stack-md'>
            <div className="select-media-label__title">Select Media Label</div>
            <div className="stack-sm">
                <Option<MediaLabelType> label="Fan Art" value="fanArt" isSelected={selected === "fanArt"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label="Official" value="official" isSelected={selected === "official"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label="Original" value="original" isSelected={selected === "original"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label="Quote" value="quote" isSelected={selected === "quote"} onSelect={(value) => setSelected(value)}/>
                <Option<MediaLabelType> label="AI" value="ai" isSelected={selected === "ai"} onSelect={(value) => setSelected(value)}/>
            </div>
            {selected && (<MediaLabelDescription type={selected} lang="en" />)}
            <SubmitButton
                label='Submit'
                onClick={() => {
                    if (!selected) return;
                    onSubmit(selected);
                }}
                disabled={!selected}
            />
        </BottomSheet>
    )
}
