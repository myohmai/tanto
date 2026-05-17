"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { PostGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getUserRoomData } from "@/repositories/userRoom";

import type { GlossData, RoomData, SalonData, UserRoomData } from "@/app/types";

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
            const userRoom = userRooms.find(
                (userRoom) =>
                    userRoom.userId === currentUserId &&
                    userRoom.roomId === params.roomId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);

            if (userRoom) {
                setCurrentUserRoom(userRoom);
                return;
            }

            if (room?.roomHost?.userId === currentUserId) {
                setCurrentUserRoom({
                    userId: currentUserId,
                    roomId: room.roomId,
                    roomName: room.roomName,
                    iconUrl: room.roomHost.iconUrl ?? undefined,
                    subIcon: room.roomHost.subIcon ?? null,
                    userName: room.roomHost.userName ?? currentUserId,
                });
                return;
            }

            setCurrentUserRoom({
                userId: currentUserId,
                roomId: params.roomId,
                roomName: room?.roomName ?? "",
                iconUrl: undefined,
                subIcon: null,
                userName: currentUserId,
            });
        });
    }, [params.roomId, params.salonId]);

    if (!roomData || !salonData || !currentUserRoom) return null;

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
            lang="ja"
        />
    );
}
