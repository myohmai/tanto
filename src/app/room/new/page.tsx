"use client";

import { useRouter } from "next/navigation";

import { CreateRoom } from "@/app/components/room/RoomSetting";
import type { RoomData } from "@/app/types/room";

export default function Page() {
    const router = useRouter();

    return (
        <CreateRoom
            isPremium={false}
            onCreateRoom={(payload: RoomData) => {
                const saved = localStorage.getItem("created-rooms");
                const createdRooms: RoomData[] = saved ? JSON.parse(saved) : [];

                localStorage.setItem(
                    "created-rooms",
                    JSON.stringify([payload, ...createdRooms])
                );

                router.push(`/room/${payload.roomId}`);
            }}
        />
    );
}

