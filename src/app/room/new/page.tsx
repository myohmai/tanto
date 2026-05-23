"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateRoom } from "@/app/components/room/RoomSetting";
import type { RoomData } from "@/app/types/room";
import { saveRoom } from "@/repositories/room";
import { addUserRoomEntities } from "@/repositories/userRoomEntity";
import { toggleJoinRoom } from "@/repositories/userRoom";

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            {error && (
                <div style={{ color: 'red', padding: '8px' }}>{error}</div>
            )}
            <CreateRoom
                isPremium={false}
                onCreateRoom={async (payload: RoomData) => {
                    setError(null);
                    try {
                        await saveRoom(payload);

                        if (payload.roomHost?.userId) {
                            await toggleJoinRoom({
                                userId: payload.roomHost.userId,
                                roomId: payload.roomId,
                                roomName: payload.roomName,
                                iconUrl: payload.roomHost.iconUrl ?? undefined,
                                subIcon: payload.roomHost.subIcon ?? undefined,
                                userName: payload.roomHost.userName ?? "",
                            });
                        }

                        if (payload.roomHost?.userId && payload.entityIds.length > 0) {
                            await addUserRoomEntities(payload.roomHost.userId, payload.roomId, payload.entityIds);
                        }

                        router.push(`/room/${payload.roomId}`);
                    } catch (e) {
                        console.error('Room creation failed:', e);
                        setError(e instanceof Error ? e.message : 'Room creation failed');
                    }
                }}
            />
        </>
    );
}
