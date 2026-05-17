"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicList } from "@/app/components/list/TopicList";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getTopics } from "@/repositories/topic";

import { type SalonData, type RoomData, type Topic } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string }>();
    
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [topicData, setTopicData] = useState<Topic[]>([]);

    useEffect(() => {
            getRooms().then((rooms) => {
                const room = rooms.find(r => r.roomId === params.roomId);
                setRoomData(room ?? null);
            });
    
            getSalons().then((salons) => {
                setSalonData(
                    salons.find(s => s.salonId === params.salonId) ?? null
                );
            });
    
            getTopics().then((topics) => {
                setTopicData(
                    topics.filter(
                        (topic) =>
                            topic.roomId === params.roomId &&
                            topic.salonId === params.salonId
                    )
                );
            });
        }, [params]);

    if (!roomData || !salonData) return null;

    return (
        <div className="topic-page">
            <div className="topic-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData?.salonName ?? ""}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${params.roomId}`)}
                    onSalon={() => router.push(`/room/${params.roomId}/salon/${params.salonId}`)}
                    onPin={() => {}}
                    onEdit={() => {}}
                    onMute={() => {}}
                    isHost={false}
                />
            </div>
            <TopicList
                topics={topicData}
                onQuote={(topicId) =>
                    router.push(
                        `/room/${params.roomId}/salon/${params.salonId}/quote?topicId=${topicId}`
                    )
                }
                onBookMark={() => {}}
                onBlock={() => {}}
                isBookMarked={false}
            />
        </div>
    )
}
