import { MenuButton } from "@/app/components/buttons/MenuButton";
import { TopicContent } from "@/app/components/content/TopicContent";
import { QuoteButton } from "@/app/components/buttons/QuoteButton";
import { BookMarkButton } from "@/app/components/buttons/BookMarkButton";

import { MediaItem } from "@/app/components/media/Media";
import { MediaLabelType, Lang } from "@/app/components/media/MediaLabel";

import './TopicListCard.scss'

type Props = {
    postedAt: string;
    topicContent: string;
    source?: MediaItem[];
    type?: MediaLabelType;
    lang?: Lang;
    url?: string;
    onSeeAlso?: () => void;
    onMenu: () => void;
    onQuote: () => void;
    onBookMark: () => void;
    isBookmarked: boolean;
}

export const TopicListCard = ({
    postedAt,
    topicContent,
    source,
    type,
    lang,
    url,
    onSeeAlso,
    onMenu,
    onQuote,
    onBookMark,
    isBookmarked
}: Props ) => {
        // Date caluculate

    const formatPostedAt = (postedAt: string, lang: 'ja' | 'en' = 'ja') => {
        const now = new Date();
        const date = new Date(postedAt);
        const diffMs = now.getTime() - date.getTime();

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diffMs < minute) {
            return lang === 'ja' ? '今' : 'now';
        }

        if (diffMs < hour) {
            const mins = Math.floor(diffMs / minute);
            return lang === 'ja' ? `${mins}分前` : `${mins}m ago`;
        }

        if (diffMs < day) {
            const hours = Math.floor(diffMs / hour);
            return lang === 'ja' ? `${hours}時間前` : `${hours}h ago`;
        }

        if (diffMs < day * 7) {
            const days = Math.floor(diffMs / day);
            return lang === 'ja'
            ? days === 1 ? '1日前' : `${days}日前`
            : days === 1 ? '1 day ago' : `${days} days ago`;
        }

        return lang === 'ja'
            ? date.toLocaleDateString('ja-JP')
            : date.toLocaleDateString('en-US');
    };
    return (
        <div className="topic-card padding-md stack-md bg-color-primary text-color-primary">
            <div className="topic-card__header">
                <span className="topic-card__date">{formatPostedAt(postedAt, lang)}</span>
                <MenuButton onClick={onMenu} />
            </div>
            <TopicContent topicContent={topicContent} source={source} type={type} lang={lang} url={url} onClick={onSeeAlso} />
            <div className="topic-card__footer">
                <QuoteButton onClick={onQuote} />
                <BookMarkButton onToggle={onBookMark} isBookmarked={isBookmarked}/>
            </div>
        </div>
    )
}