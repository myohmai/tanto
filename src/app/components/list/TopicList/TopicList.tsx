import { TopicListCard } from "@/app/components/card/TopicListCard";

import type { Topic } from "@/app/types";

import './TopicList.scss'

import { useRef } from "react";

type Props = {
    topics: Topic[];
    onQuote: (topicId: string) => void;
    onBookMark: () => void;
    onBlock: () => void;
    isBookMarked: boolean;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const TopicList = ({
    topics,
    onQuote,
    onBookMark,
    onBlock,
    isBookMarked,
    onRefresh,
    isLoading
}: Props) => {
    const startY = useRef<number | null>(null);
    const pullDistance = useRef(0);
    const isTriggered = useRef(false);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop !== 0) return;
            startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (startY.current === null) return;

        const currentY = e.touches[0].clientY;
        pullDistance.current = currentY - startY.current;

        if (pullDistance.current > 10 && !isTriggered.current) {
            isTriggered.current = true;
            onRefresh?.();
        }
    };
    const handleTouchEnd = () => {
        startY.current = null;
        pullDistance.current = 0;
        isTriggered.current = false;
    };
    return (
        <div
            className="topic-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
        {topics.map((topic) => (
            <TopicListCard
                key={topic.topicId}
                topic={topic}
                onQuote={onQuote}
                onBookMark={onBookMark}
                onBlock={onBlock}
                isBookmarked={isBookMarked}
            />
        ))}

        {isLoading && (
            <div className="topic-list__loading">
                Loading...
            </div>
        )}
        {topics.length === 0 && !isLoading && (
            <div className="topic-list__empty">
                <div>No posts yet</div>

                {onRefresh && (
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            onRefresh?.();
                        }}
                    >
                        Refresh
                    </button>
                )}
            </div>
        )}
        </div>
    )
}
