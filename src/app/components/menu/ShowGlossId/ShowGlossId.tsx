import { BottomSheet } from '@/app/components/menu/BottomSheet'
import { IdIcon, CopyIcon } from '@/app/components/icons'

import { useState } from 'react'

import './ShowGlossId.scss'

type Props = {
    glossId: string;
}

export const ShowGlossId = ({ glossId }: Props) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(glossId)

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        },1500)
    }
    return (
        <BottomSheet >
            <div className="show-gloss-id bg-color-secondary padding-md-lg inline-md text-color-primary">
                <IdIcon className='icon-color-primary'/>
                <div className='show-gloss-id__container'>
                    <div>Gloss ID</div>
                    <div>
                        <span className='show-gloss-id__id'>{glossId}</span>
                        <button type='button' onClick={handleCopy}>
                            <CopyIcon className='icon-color-primary' />
                        </button>
                    </div>
                </div>
            </div>
            {copied && (
                <div className="toast">Copied!</div>
            )}
        </BottomSheet>
    )
}