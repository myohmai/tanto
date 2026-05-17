"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { SalonSettings } from "@/app/components/room/SalonSettings";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";

import type { RoomData, SalonData} from "@/app/types";

const readSalonStorage = (key: string): SalonData[] => {
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const writeSalonStorage = (key: string, salons: SalonData[]) => {
    localStorage.setItem(key, JSON.stringify(salons));
};

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string }>();

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);

    useEffect(() => {
        Promise.all([
            getRooms(),
            getSalons(),
        ]).then(([rooms, salons]) => {
            const room = rooms.find((room) => room.roomId === params.roomId);
            const salon = salons.find(
                (salon) =>
                    salon.roomId === params.roomId &&
                    salon.salonId === params.salonId
            );

            setRoomData(room ?? null);
            setSalonData(salon ?? null);
        });
    }, [params.roomId, params.salonId]);

    if (!roomData || !salonData ) return null;

    return (
        <SalonSettings
            salonData={salonData}
            roomName={roomData.roomName}
            roomIconUrl={roomData.roomIconUrl}
            onCancel={() => router.back()}
            onChangeSalonData={(payload) => setSalonData(payload)}
            onDelete={() => {
                const createdSalons = readSalonStorage("created-salons");
                const filteredCreatedSalons = createdSalons.filter(
                    (salon) => salon.salonId !== params.salonId
                );

                writeSalonStorage("created-salons", filteredCreatedSalons);

                const deletedSalonIdsSaved = localStorage.getItem("deleted-salon-ids");
                const deletedSalonIds: string[] = deletedSalonIdsSaved
                    ? JSON.parse(deletedSalonIdsSaved)
                    : [];

                if (!deletedSalonIds.includes(params.salonId)) {
                    localStorage.setItem(
                        "deleted-salon-ids",
                        JSON.stringify([params.salonId, ...deletedSalonIds])
                    );
                }

                router.push(`/room/${params.roomId}`);
            }}
            onSubmit={(payload) => {
                const createdSalons = readSalonStorage("created-salons");
                const isCreatedSalon = createdSalons.some(
                    (salon) => salon.salonId === payload.salonId
                );

                if (isCreatedSalon) {
                    writeSalonStorage(
                        "created-salons",
                        createdSalons.map((salon) =>
                            salon.salonId === payload.salonId ? payload : salon
                        )
                    );
                } else {
                    const updatedSalons = readSalonStorage("updated-salons");
                    const nextUpdatedSalons = [
                        payload,
                        ...updatedSalons.filter(
                            (salon) => salon.salonId !== payload.salonId
                        ),
                    ];

                    writeSalonStorage("updated-salons", nextUpdatedSalons);
                }

                router.push(`/room/${params.roomId}/salon/${params.salonId}`);
            }}
        />
    )
}
