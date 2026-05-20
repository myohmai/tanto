"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import { SalonSettings } from "@/app/components/room/SalonSettings";

import { getRooms } from "@/repositories/room";
import { getSalons, deleteSalon, updateSalon} from "@/repositories/salon";

import type { RoomData, SalonData} from "@/app/types";



export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);

    useEffect(() => {
        Promise.all([
            getRooms(),
            getSalons(),
        ]).then(([rooms, salons]) => {
            const room = rooms.find((room) => room.roomId === roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === roomId &&
                    salon.salonId === salonId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
        });
    }, [roomId, salonId]);

    if (!roomData || !salonData ) return null;

    return (
        <SalonSettings
            salonData={salonData}
            roomName={roomData.roomName}
            roomIconUrl={roomData.roomIconUrl}
            onCancel={() => router.back()}
            onChangeSalonData={(payload) => setSalonData(payload)}
            onDelete={async () => {
                await deleteSalon(salonId);
                router.push(`/room/${roomId}`);
            }}
            onSubmit={async (payload) => {
                await updateSalon(payload);
                router.push(`/room/${roomId}/salon/${salonId}`);
            }}
        />
    )
}
