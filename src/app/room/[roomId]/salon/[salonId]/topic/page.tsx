"use client";
import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicList } from "@/app/components/list/TopicList";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getTopics } from "@/repositories/topic";
import { getBlocksByUser, toggleBlock } from "@/repositories/block";

import { type SalonData, type RoomData, type Topic } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);
    
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [topicData, setTopicData] = useState<Topic[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());

    useEffect(() => {
            getRooms().then((rooms) => {
                const room = rooms.find(r => r.roomId === roomId);
                setRoomData(room ?? null);
            });
    
            getSalons().then((salons) => {
                setSalonData(
                    salons.find(s => s.salonId === salonId) ?? null
                );
            });
    
            getTopics().then((topics) => {
                setTopicData(
                    topics.filter(
                        (topic) =>
                            topic.roomId === roomId &&
                            topic.salonId === salonId
                    )
                );
            });
        }, [roomId, salonId]);

        useEffect(() => {
            getBlocksByUser("currentUser").then((blocks) => {
                setBlockedUserIds(
                    new Set(blocks.map(b => b.targetUserId))
                );
            });
        }, []);

        const handleBlock = async (targetUserId: string) => {
            await toggleBlock(targetUserId, "currentUser");

            const blocks = await getBlocksByUser("currentUser");

            setBlockedUserIds(
                new Set(blocks.map(b => b.targetUserId))
            );
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
                    router.push(
                        `/room/${roomId}/salon/${salonId}/quote?topicId=${topicId}`
                    )
                }
                onBookMark={() => {}}
                onBlock={handleBlock}
                isBookMarked={false}
                blockedUserIds={blockedUserIds}
            />
        </div>
    )
}
