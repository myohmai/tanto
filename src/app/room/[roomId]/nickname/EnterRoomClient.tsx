"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnterTheRoom } from "@/app/components/room/EnterTheRoom";
import { getRooms } from "@/repositories/room";
import { getCurrentUserId } from "@/repositories/currentUser";
import { toggleJoinRoom } from "@/repositories/userRoom";
import { addUserRoomEntities } from "@/repositories/userRoomEntity";

export const EnterRoomClient = ({ roomId, returnTo }: { roomId: string; returnTo?: string }) => {
    const router = useRouter();

    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = await getCurrentUserId();
                const rooms = await getRooms();

                const found = rooms.find(r => String(r.roomId) === String(roomId));

                if (!found) return;

                setRoom({ userId, room: found });
            } finally {
                setLoading(false);
            }
        })();
    }, [roomId]);

    if (loading) return null;
    if (!room) return null;

    const handleEnter = async (payload: any) => {
        await toggleJoinRoom(payload);
        addUserRoomEntities(payload.userId, roomId, room.room.entityIds ?? []);

        router.push(returnTo ?? `/room/${roomId}`);
    };

    return (
        <EnterTheRoom
            userId={room.userId}
            roomId={room.room.roomId}
            roomName={room.room.roomName}
            roomIconUrl={room.room.roomIconUrl}
            bannerUrl={room.room.roomBannerUrl}
            roomRule={room.room.roomRule}
            roomMemberIni={room.room.roomMemberIni}
            onEnter={handleEnter}
        />
    );
};