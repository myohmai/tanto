"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicBox } from "@/app/components/post/TopicBox";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getUserRoomData } from "@/repositories/userRoom";

import type { RoomData, SalonData, Topic, UserRoomData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        Promise.all([
            getRooms(),
            getSalons(),
            getUserRoomData(),
            getCurrentUserId(),
        ]).then(([rooms, salons, userRooms, currentUserId]) => {
            const room = rooms.find((room) => room.roomId === roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === roomId &&
                    salon.salonId === salonId
            );
            const currentUserRoom = userRooms.find(
                (userRoom) =>
                    userRoom.userId === currentUserId &&
                    userRoom.roomId === roomId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
            setCurrentUserRoom(currentUserRoom ?? null);
        });
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
                onWhisper={(payload: Topic) => {
                    const saved = localStorage.getItem("posted-topics");
                    const postedTopics: Topic[] = saved ? JSON.parse(saved) : [];

                    localStorage.setItem(
                        "posted-topics",
                        JSON.stringify([payload, ...postedTopics])
                    );

                    router.push(`/room/${roomId}/salon/${salonId}`);
                }}
                lang="ja"
            />
        </div>
    );
}
