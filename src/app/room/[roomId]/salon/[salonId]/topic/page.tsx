"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import './page.scss'

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicList } from "@/app/components/list/TopicList";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getTopics } from "@/repositories/topic";
import { getBlocksByUser, toggleBlock } from "@/repositories/block";
import { getBookmarksByUser, toggleBookmark, type TopicBookmark } from "@/repositories/bookmark";
import { getCurrentUserId } from "@/repositories/currentUser";

import { type SalonData, type RoomData, type Topic } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [topicData, setTopicData] = useState<Topic[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [bookmarks, setBookmarks] = useState<TopicBookmark[]>([]);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setUserId(uid);

            const [rooms, salons, topics, blocks, bms] = await Promise.all([
                getRooms(),
                getSalons(),
                getTopics(),
                getBlocksByUser(uid),
                getBookmarksByUser(uid),
            ]);

            setRoomData(rooms.find(r => r.roomId === roomId) ?? null);
            setSalonData(salons.find(s => s.salonId === salonId) ?? null);
            setTopicData(topics.filter(t => t.roomId === roomId && t.salonId === salonId));
            setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));
            setBookmarks(bms);
        };

        load();
    }, [roomId, salonId]);

    const handleBookMark = async (topicId: string) => {
        await toggleBookmark(topicId, userId);
        const bms = await getBookmarksByUser(userId);
        setBookmarks(bms);
    };

    const handleBlock = async (targetUserId: string) => {
        await toggleBlock({ userId, targetUserId });
        const blocks = await getBlocksByUser(userId);
        setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));
    };

    if (!roomData || !salonData) return null;

    return (
        <div className="topic-page">
            <div className="topic-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData?.salonName ?? ""}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${roomId}`)}
                    onSalon={() => router.push(`/room/${roomId}/salon/${salonId}`)}
                    onPin={() => {}}
                    onEdit={() => router.push(`/room/${roomId}/salon/${salonId}/edit`)}
                    onMute={() => {}}
                    isHost={false}
                    isMuted={false}
                />
            </div>
            <TopicList
                topics={topicData}
                onQuote={(topicId) =>
                    router.push(`/room/${roomId}/salon/${salonId}/quote?topicId=${topicId}`)
                }
                onBookMark={handleBookMark}
                onBlock={handleBlock}
                isBookMarked={(topicId) => bookmarks.some(b => b.topicId === topicId)}
                blockedUserIds={blockedUserIds}
            />
        </div>
    );
}
