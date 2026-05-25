"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicBox } from "@/app/components/post/TopicBox";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRoomById } from "@/repositories/room";
import { uploadGlossMedia } from "@/repositories/storage";
import { getSalonsByRoom } from "@/repositories/salon";
import { postTopic } from "@/repositories/topic";
import { getUserRoomByRoomId } from "@/repositories/userRoom";

import type { RoomData, SalonData, Topic, UserRoomData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        const run = async () => {
            const currentUserId = await getCurrentUserId();
            const [room, salons, currentUserRoom] = await Promise.all([
                getRoomById(roomId),
                getSalonsByRoom(roomId),
                getUserRoomByRoomId(roomId, currentUserId),
            ]);
            const salon = salons.find(s => s.salonId === salonId) ?? null;

            setRoomData(room);
            setSalonData(salon);
            setCurrentUserRoom(currentUserRoom ?? null);
        };
        run();
    }, [roomId, salonId]);

    if (!roomData || !salonData || !currentUserRoom) return null;

    return (
        <div className="topic-new-page">
            <SalonTopBar
                roomName={roomData.roomName}
                salonName={salonData.salonName}
                onBack={() => router.back()}
                onRoom={() => router.push(`/room/${roomId}`)}
                onSalon={() =>
                    router.push(`/room/${roomId}/salon/${salonId}`)
                }
                onPin={() => {}}
                onEdit={() =>
                    router.push(`/room/${roomId}/salon/${salonId}/edit`)
                }
                onMute={() => {}}
                isMuted={false}
                isHost={false}
            />
            <TopicBox
                roomId={roomData.roomId}
                salonId={salonData.salonId ?? salonId}
                userId={currentUserRoom.userId}
                onSelectFile={() => {}}
                onUploadFile={uploadGlossMedia}
                onWhisper={async (payload: Topic) => {
                    await postTopic(payload);
                    router.push(`/room/${roomId}/salon/${salonId}`);
                }}
                lang="ja"
            />
        </div>
    );
}
