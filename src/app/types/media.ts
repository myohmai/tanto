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

export type MediaItem = {
    type: "image" | "video";
    url: string;
};