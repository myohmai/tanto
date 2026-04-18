import { InfoIcon } from "@/app/components/icons";
import "./MediaLabelDescription.scss";

import { MediaLabelType } from '@/app/components/media/MediaLabel'

type DescriptionText = {
    id: MediaLabelType;
    message: {
        en: string;
        ja: string;
    };
};

const description: DescriptionText[] = [
    {
        id: 'fanArt',
        message: {
            en: 'Your fan-made content',
            ja: 'あなたが制作した二次創作コンテンツ',
        },
    },
    {
        id: 'official',
        message: {
            en: 'Official content',
            ja: '公式が公開しているコンテンツ',
        },
    },
    {
        id: 'original',
        message: {
            en: 'Your own content',
            ja: 'あなたが撮影・作成したコンテンツ',
        },
    },
    {
        id: 'quote',
        message: {
            en: 'Quoted / reposted content',
            ja: '他者のコンテンツを引用・転載したもの',
        },
    },
    {
        id: 'ai',
        message: {
            en: 'AI-generated content',
            ja: 'AIによって生成されたコンテンツ',
        },
    }
];

type Props = {
    type: MediaLabelType;
    lang: 'en' | 'ja';
};

export const MediaLabelDescription = ({ type, lang }: Props) => {
    const descriptionMassege = description.find((n) => n.id === type)?.message[lang] || '';
    return (
        <div className="media-label-description inline-sm text-color-secondary">
            <InfoIcon size="sm" className="media-label-description__icon" />
            <span className="media-label-description__message">{descriptionMassege}</span>
        </div>
    );
};