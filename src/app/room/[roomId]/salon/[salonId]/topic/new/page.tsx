"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicBox } from "@/app/components/post/TopicBox";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getUserRoomData } from "@/repositories/userRoom";

import type { RoomData, SalonData, Topic, UserRoomData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string }>();

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
            const room = rooms.find((room) => room.roomId === params.roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === params.roomId &&
                    salon.salonId === params.salonId
            );
            const currentUserRoom = userRooms.find(
                (userRoom) =>
                    userRoom.userId === currentUserId &&
                    userRoom.roomId === params.roomId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
            setCurrentUserRoom(currentUserRoom ?? null);
        });
    }, [params.roomId, params.salonId]);

    if (!roomData || !salonData || !currentUserRoom) return null;

    return (
        <div className="topic-new-page">
            <SalonTopBar
                roomName={roomData.roomName}
                salonName={salonData.salonName}
                onBack={() => router.back()}
                onRoom={() => router.push(`/room/${params.roomId}`)}
                onSalon={() =>
                    router.push(`/room/${params.roomId}/salon/${params.salonId}`)
                }
                onPin={() => {}}
                onEdit={() =>
                    router.push(`/room/${params.roomId}/salon/${params.salonId}/edit`)
                }
                onMute={() => {}}
                isHost={false}
            />
            <TopicBox
                roomId={roomData.roomId}
                salonId={salonData.salonId ?? params.salonId}
                userId={currentUserRoom.userId}
                onSelectFile={() => {}}
                onWhisper={(payload: Topic) => {
                    const saved = localStorage.getItem("posted-topics");
                    const postedTopics: Topic[] = saved ? JSON.parse(saved) : [];

                    localStorage.setItem(
                        "posted-topics",
                        JSON.stringify([payload, ...postedTopics])
                    );

                    router.push(`/room/${params.roomId}/salon/${params.salonId}`);
                }}
                lang="ja"
            />
        </div>
    );
}
