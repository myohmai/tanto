import './MediaLabel.scss'

export const mediaLabelText = {
    fanArt: {
        en: 'Fan Art',
        ja: 'ファンアート'
    },
    official: {
        en: 'Official',
        ja: '公式'
    },
    original: {
        en: 'Original',
        ja: 'オリジナル',
    },
    quote: {
        en: 'Quote',
        ja: '引用'
    },
    ai: {
        en: 'AI',
        ja: 'AI'
    }
} as const;

export type MediaLabelType = keyof typeof mediaLabelText;

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