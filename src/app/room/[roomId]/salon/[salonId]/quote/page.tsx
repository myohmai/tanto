"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { PostGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getTopics } from "@/repositories/topic";
import { getUserRoomData } from "@/repositories/userRoom";

import type {
    GlossData,
    RoomData,
    SalonData,
    Topic,
    UserRoomData,
} from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string }>();
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [topic, setTopic] = useState<Topic | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        if (!topicId) return;

        Promise.all([
            getRooms(),
            getSalons(),
            getTopics(),
            getUserRoomData(),
            getCurrentUserId(),
        ]).then(([rooms, salons, topics, userRooms, currentUserId]) => {
            const room = rooms.find((room) => room.roomId === params.roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === params.roomId &&
                    salon.salonId === params.salonId
            );
            const topic = topics.find(
                (topic) =>
                    topic.topicId === topicId &&
                    topic.roomId === params.roomId &&
                    topic.salonId === params.salonId
            );
            const currentUserRoom = userRooms.find(
                (userRoom) =>
                    userRoom.userId === currentUserId &&
                    userRoom.roomId === params.roomId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
            setTopic(topic ?? null);
            setCurrentUserRoom(currentUserRoom ?? null);
        });
    }, [params.roomId, params.salonId, topicId]);

    if (!roomData || !salonData || !topic || !currentUserRoom) return null;

    return (
        <PostGloss
            onCancel={() => router.back()}
            iconUrl={currentUserRoom.iconUrl}
            subIcon={currentUserRoom.subIcon}
            roomId={roomData.roomId}
            salonId={salonData.salonId ?? params.salonId}
            userId={currentUserRoom.userId}
            roomName={roomData.roomName}
            salonName={salonData.salonName}
            userName={currentUserRoom.userName}
            onRoom={() => router.push(`/room/${params.roomId}`)}
            onSalon={() =>
                router.push(`/room/${params.roomId}/salon/${params.salonId}`)
            }
            onSelectFile={() => {}}
            onPost={(payload: GlossData) => {
                const saved = localStorage.getItem("posted-glosses");
                const postedGlosses: GlossData[] = saved ? JSON.parse(saved) : [];

                localStorage.setItem(
                    "posted-glosses",
                    JSON.stringify([payload, ...postedGlosses])
                );

                router.push(`/room/${params.roomId}/salon/${params.salonId}`);
            }}
            topic={topic}
            lang="ja"
        />
    );
}
