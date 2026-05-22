"use client";

import { useRouter } from "next/navigation";

import { CreateRoom } from "@/app/components/room/RoomSetting";
import type { RoomData } from "@/app/types/room";
import { saveRoom } from "@/repositories/room";
import { addUserRoomEntities } from "@/repositories/userRoomEntity";

export default function Page() {
    const router = useRouter();

    return (
        <CreateRoom
            isPremium={false}
            onCreateRoom={async (payload: RoomData) => {
                await saveRoom(payload);

                if (payload.roomHost?.userId && payload.entityIds.length > 0) {
                    await addUserRoomEntities(payload.roomHost.userId, payload.roomId, payload.entityIds);
                }

                router.push(`/room/${payload.roomId}`);
            }}
        />
    );
}

