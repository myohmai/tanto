"use client";
import { RoomSetting } from "@/app/components/room/RoomSetting";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import { getRooms, saveRoom, deleteRoom } from "@/repositories/room";

import type { RoomData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    const router = useRouter();

    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((r) => r.roomId === roomId);
            setRoomData(room ?? null);
        });
    }, [roomId]);

    if (!roomData) return null;

    return (
        <RoomSetting
            roomData={roomData}
            onChangeRoomData={setRoomData}
            onSubmitRoomSetting={(data) => {
                    saveRoom(data);
                    router.push(`/room/${roomId}`);
                }}
            onDeleteRoom={() => {
                    deleteRoom(roomId);
                    router.push("/feed");
                }}
            isPremium={false}
        />
    );
}