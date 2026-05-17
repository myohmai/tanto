"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ReplyGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getGlosses } from "@/repositories/gloss";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getUserRoomData } from "@/repositories/userRoom";

import type { GlossData, RoomData, SalonData, UserRoomData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{
        roomId: string;
        salonId: string;
        glossId: string;
    }>();

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [replyToGloss, setReplyToGloss] = useState<GlossData | null>(null);
    const [replyToUser, setReplyToUser] = useState<UserRoomData | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        Promise.all([
            getRooms(),
            getSalons(),
            getGlosses(),
            getUserRoomData(),
            getCurrentUserId(),
        ]).then(([rooms, salons, glosses, userRooms, currentUserId]) => {
            const room = rooms.find((room) => room.roomId === params.roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === params.roomId &&
                    salon.salonId === params.salonId
            );
            const gloss = glosses.find((gloss) => gloss.glossId === params.glossId);
            const replyToUser = gloss
                ? userRooms.find(
                    (userRoom) =>
                        userRoom.userId === gloss.userId &&
                        userRoom.roomId === gloss.roomId
                )
                : null;
            const currentUserRoom = userRooms.find(
                (userRoom) =>
                    userRoom.userId === currentUserId &&
                    userRoom.roomId === params.roomId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
            setReplyToGloss(gloss ?? null);
            setReplyToUser(replyToUser ?? null);
            setCurrentUserRoom(currentUserRoom ?? null);
        });
    }, [params.roomId, params.salonId, params.glossId]);

    if (!roomData || !salonData || !replyToGloss || !currentUserRoom) return null;

    return (
        <ReplyGloss
            replyTo={{
                glossId: replyToGloss.glossId,
                glossContent: replyToGloss.content,
                iconUrl: replyToUser?.iconUrl,
                subIcon: replyToUser?.subIcon,
                userName: replyToUser?.userName ?? replyToGloss.userName,
            }}
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

                router.push(
                    `/room/${params.roomId}/salon/${params.salonId}/gloss/${params.glossId}`
                );
            }}
            lang="ja"
        />
    );
}
