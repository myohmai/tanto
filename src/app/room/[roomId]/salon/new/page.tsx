"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CreateSalon } from "@/app/components/room/SalonSettings";

import { getRooms } from "@/repositories/room";

import type { RoomData, SalonData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string }>();
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((room) => room.roomId === params.roomId);
            setRoomData(room ?? null);
        });
    }, [params.roomId]);

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

                router.push(`/room/${params.roomId}/salon/${payload.salonId}`);
            }}
            onCancel={() => router.back()}
        />
    );
}
