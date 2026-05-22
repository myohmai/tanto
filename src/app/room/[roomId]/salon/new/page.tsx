"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";

import { CreateSalon } from "@/app/components/room/SalonSettings";

import { getRooms } from "@/repositories/room";
import { createSalon } from "@/repositories/salon";
import { getCurrentUserId } from "@/repositories/currentUser";

import type { RoomData, SalonData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const router = useRouter();
    const { roomId } = use(params);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUserId().then(setUserId);
    }, []);

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((room) => room.roomId === roomId);
            setRoomData(room ?? null);
        });
    }, [roomId]);

    if (!roomData) return null;

    const isHost = roomData.roomHost?.userId === userId;

    return (
        <CreateSalon
            roomId={roomData.roomId}
            roomName={roomData.roomName}
            roomIconUrl={roomData.roomIconUrl ?? undefined}
            isHost={isHost}
            onSubmit={async (payload: SalonData) => {
                await createSalon(payload);
                router.push(`/room/${roomId}/salon/${payload.salonId}`);
            }}
            onCancel={() => router.back()}
        />
    );
}
