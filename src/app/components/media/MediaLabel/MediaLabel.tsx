import './MediaLabel.scss'

import { mediaLabelText, MediaLabelType } from '@/app/types/media';

export type Lang = 'en' | 'ja';

type Props = {
    type: MediaLabelType;
    lang: Lang;
}

export const MediaLabel = ({ type, lang }: Props ) => {
    const Label = mediaLabelText[type][lang];
    return(
        <div className={`media-label padding-xs-sm ${type}`}>
            <span>{Label}</span>
        </div>
    )
}