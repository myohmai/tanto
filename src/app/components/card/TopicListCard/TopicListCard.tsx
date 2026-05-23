import { MenuButton } from "@/app/components/buttons/MenuButton";
import { TopicContent } from "@/app/components/content/TopicContent";
import { QuoteButton } from "@/app/components/buttons/QuoteButton";
import { BookMarkButton } from "@/app/components/buttons/BookMarkButton";
import { TopicListMenu } from "@/app/components/menu/TopicListMenu";

import { Lang } from "@/app/components/media/MediaLabel";

import { Topic } from "@/app/types";

import { useState } from "react";

import './TopicListCard.scss'

type Props = {
    topic: Topic;
    lang?: Lang;
    onSeeAlso?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onQuote: (topicId: string) => void;
    onBookMark: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onBlock: () => void;
    isBookmarked: boolean;
    isBlocked: boolean;
}

export const TopicListCard = ({
    topic,
    lang,
    onSeeAlso,
    onQuote,
    onBookMark,
    onBlock,
    isBookmarked,
    isBlocked
}: Props ) => {
    const [isOpen, setIsOpen] = useState(false);
        // Date caluculate

    const formatPostedAt = (postedAt: string, lang: Lang = 'ja') => {
        const now = new Date();
        const date = new Date(postedAt);
        const diffMs = now.getTime() - date.getTime();

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diffMs < minute) {
            return lang === 'ja' ? '今' : lang === 'ko' ? '지금' : 'now';
        }

        if (diffMs < hour) {
            const mins = Math.floor(diffMs / minute);
            return lang === 'ja' ? `${mins}分前` : lang === 'ko' ? `${mins}분 전` : `${mins}m ago`;
        }

        if (diffMs < day) {
            const hours = Math.floor(diffMs / hour);
            return lang === 'ja' ? `${hours}時間前` : lang === 'ko' ? `${hours}시간 전` : `${hours}h ago`;
        }

        if (diffMs < day * 7) {
            const days = Math.floor(diffMs / day);
            return lang === 'ja'
                ? `${days}日前`
                : lang === 'ko'
                ? `${days}일 전`
                : days === 1 ? '1 day ago' : `${days} days ago`;
        }

        return lang === 'ja'
            ? date.toLocaleDateString('ja-JP')
            : lang === 'ko'
            ? date.toLocaleDateString('ko-KR')
            : date.toLocaleDateString('en-US');
    };
    return (
        <div className="topic-card padding-md stack-md bg-color-primary text-color-primary">
            <div className="topic-card__header">
                <span className="topic-card__date">{formatPostedAt(topic.postedAt, lang)}</span>
                <MenuButton
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsOpen(true)
                    }} />
            </div>
            <TopicContent topic={topic} lang={lang}onClick={onSeeAlso} />
            <div className="topic-card__footer">
                <QuoteButton onClick={() => onQuote(topic.topicId)} />
                <BookMarkButton onToggle={onBookMark} isBookmarked={isBookmarked}/>
            </div>
            <TopicListMenu onBlock={onBlock} isOpen={isOpen} onClose={() => setIsOpen(false)} isBlocked={isBlocked} />
        </div>
    )
}
