"use client";
import './page.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSideMenu } from "@/app/context/SideMenuContext";

import { HeadBar } from "@/app/components/bar/HeadBar";
import { TopicList } from "@/app/components/list/TopicList";

import { getTopicsByIds } from "@/repositories/topic";
import { getBookmarksByUser, toggleBookmark, type TopicBookmark } from "@/repositories/bookmark";
import { getBlocksByUser, toggleBlock } from "@/repositories/block";
import { getCurrentUserId } from "@/repositories/currentUser";

import type { Topic } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const { openSideMenu } = useSideMenu();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [bookmarks, setBookmarks] = useState<TopicBookmark[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [userId, setUserId] = useState<string>("");

    const loadBookmarkedTopics = async (uid: string) => {
        const bms = await getBookmarksByUser(uid);
        const topicIds = bms.map(b => b.topicId);
        const [fetchedTopics] = await Promise.all([getTopicsByIds(topicIds)]);
        return { bms, topics: fetchedTopics };
    };

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setUserId(uid);

            const [{ bms, topics }, blocks] = await Promise.all([
                loadBookmarkedTopics(uid),
                getBlocksByUser(uid),
            ]);

            setBookmarks(bms);
            setTopics(topics);
            setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));
        };

        load();
    }, []);

    const handleBookMark = async (topicId: string) => {
        await toggleBookmark(topicId, userId);
        const { bms, topics } = await loadBookmarkedTopics(userId);
        setBookmarks(bms);
        setTopics(topics);
    };

    const handleBlock = async (targetUserId: string) => {
        await toggleBlock({ userId, targetUserId });
        const blocks = await getBlocksByUser(userId);
        setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));
    };

    return (
        <div className="bookmark-page">
            <div className="bookmark-page__sticky">
                <HeadBar
                    onSideMenu={openSideMenu}
                />
            </div>
            {topics.length === 0 ? (
                <div className="bookmark-page__empty">ブックマークした Topic はまだありません</div>
            ) : (
                <TopicList
                    topics={topics}
                    onQuote={(topicId) => {
                        const topic = topics.find(t => t.topicId === topicId);
                        if (!topic) return;
                        router.push(`/room/${topic.roomId}/salon/${topic.salonId}/quote?topicId=${topicId}`);
                    }}
                    onBookMark={handleBookMark}
                    onBlock={handleBlock}
                    isBookMarked={(topicId) => bookmarks.some(b => b.topicId === topicId)}
                    blockedUserIds={blockedUserIds}
                />
            )}
        </div>
    );
}
