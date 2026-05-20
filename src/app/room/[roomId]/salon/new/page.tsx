"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";

import { CreateSalon } from "@/app/components/room/SalonSettings";

import { getRooms } from "@/repositories/room";

import type { RoomData, SalonData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const router = useRouter();
    const { roomId } = use(params);
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((room) => room.roomId === roomId);
            setRoomData(room ?? null);
        });
    }, [roomId]);

    if (!roomData) return null;

    return (
        <CreateSalon
            roomId={roomData.roomId}
            roomName={roomData.roomName}
            roomIconUrl={roomData.roomIconUrl ?? undefined}
            onSubmit={(payload: SalonData) => {
                const saved = localStorage.getItem("created-salons");
                const createdSalons: SalonData[] = saved ? JSON.parse(saved) : [];

                localStorage.setItem(
                    "created-salons",
                    JSON.stringify([payload, ...createdSalons])
                );

                router.push(`/room/${roomId}/salon/${payload.salonId}`);
            }}
            onCancel={() => router.back()}
        />
    );
}
