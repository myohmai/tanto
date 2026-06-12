"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";

import { PostGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { postGloss } from "@/repositories/gloss";
import { uploadGlossMedia } from "@/repositories/storage";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getUserRoomData } from "@/repositories/userRoom";
import { isAdmin } from "@/lib/adminAuth";

import type { GlossData, RoomData, SalonData, UserRoomData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string; glossId: string }> }) {
    const router = useRouter();
    const { roomId, salonId, glossId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);
    const [adminFlag, setAdminFlag] = useState(false);

    useEffect(() => {
    const run = async () => {
        const [rooms, salons, currentUserId, admin] = await Promise.all([
            getRooms(),
            getSalons(),
            getCurrentUserId(),
            isAdmin(),
        ]);
        setAdminFlag(admin);

        const userRooms = await getUserRoomData(currentUserId, roomId);

        const room = rooms.find((room) => room.roomId === roomId);

        const salon = salons.find(
            (salon) =>
                salon.roomId === roomId &&
                salon.salonId === salonId
        );

        setRoomData(room ?? null);
        setSalonData(salon ?? null);

        if (userRooms) {
            setCurrentUserRoom(userRooms[0] ?? null);
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
            roomId: roomId,
            roomName: room?.roomName ?? "",
            iconUrl: undefined,
            subIcon: null,
            userName: currentUserId,
        });
    };

    run();
}, [roomId, salonId]);
    if (!roomData || !salonData || !currentUserRoom) return null;

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
            isAdmin={adminFlag}
            onPost={async (payload: GlossData) => {
                await postGloss(payload);
                router.push(`/room/${roomId}/salon/${salonId}`);
            }}
            lang="ja"
        />
    );
}
