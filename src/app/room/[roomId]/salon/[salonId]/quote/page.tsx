"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { PostGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { postGloss } from "@/repositories/gloss";
import { uploadGlossMedia } from "@/repositories/storage";
import { getRoomById } from "@/repositories/room";
import { getSalonsByRoom } from "@/repositories/salon";
import { getTopicsBySalon } from "@/repositories/topic";
import { getUserRoomByRoomId } from "@/repositories/userRoom";

import type {
    GlossData,
    RoomData,
    SalonData,
    Topic,
    UserRoomData,
} from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [topic, setTopic] = useState<Topic | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        if (!topicId) return;

        const run = async () => {
            const currentUserId = await getCurrentUserId();
            const [room, salons, topics, currentUserRoom] = await Promise.all([
                getRoomById(roomId),
                getSalonsByRoom(roomId),
                getTopicsBySalon(salonId),
                getUserRoomByRoomId(roomId, currentUserId),
            ]);
            const salon = salons.find(s => s.salonId === salonId) ?? null;
            const topic = topics.find(t => t.topicId === topicId) ?? null;

            setRoomData(room);
            setSalonData(salon);
            setTopic(topic);
            setCurrentUserRoom(currentUserRoom ?? null);
        };
        run();
    }, [roomId, salonId, topicId]);

    if (!roomData || !salonData || !topic || !currentUserRoom) return null;

    return (
        <PostGloss
            onCancel={() => router.back()}
            iconUrl={currentUserRoom.iconUrl}
            subIcon={currentUserRoom.subIcon}
            roomId={roomData.roomId}
            salonId={salonData.salonId ?? salonId}
            userId={currentUserRoom.userId}
            roomName={roomData.roomName}
            salonName={salonData.salonName}
            userName={currentUserRoom.userName}
            onRoom={() => router.push(`/room/${roomId}`)}
            onSalon={() =>
                router.push(`/room/${roomId}/salon/${salonId}`)
            }
            onSelectFile={() => {}}
            onUploadFile={uploadGlossMedia}
            onPost={async (payload: GlossData) => {
                await postGloss(payload);
                router.push(`/room/${roomId}/salon/${salonId}`);
            }}
            topic={topic}
            lang="ja"
        />
    );
}
