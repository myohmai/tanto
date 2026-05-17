"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { GlossList } from "@/app/components/list/GlossList";

import { getRooms } from "@/repositories/room";
import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getUserRoomData } from "@/repositories/userRoom";

import { GlossData, type RoomData, type UserRoomData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [users, setUsers] = useState<UserRoomData[]>([]);

    useEffect(() => {
        getGlosses().then((glosses) => {
            setGlossData(glosses);
        });

        getRooms().then((rooms) => {
            setRooms(rooms);
        });

        getUserRoomData().then((users) => {
            setUsers(users);
        });
    }, []);

    const handleFond = async (glossId: string) => {
        await updateGlossFond(glossId);
        const glosses = await getGlosses();
        setGlossData(glosses);
    };

    return (
        <div className="feed">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <GlossList
                glosses={glossData}
                scope="feed"
                user={users}
                room={rooms.map((room) => ({
                    roomId: room.roomId,
                    iconUrl: room.roomIconUrl,
                    subIcon: undefined,
                }))}
                onFond={handleFond}
                onGlossClick={(glossId) => {
                    const gloss = glossData.find((gloss) => gloss.glossId === glossId);
                    if (!gloss) return;

                    router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`);
                }}
            />
        </div>
    )
}
