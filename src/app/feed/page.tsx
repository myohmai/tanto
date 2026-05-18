"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { GlossList } from "@/app/components/list/GlossList";

import { getRooms } from "@/repositories/room";
import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";

import { GlossData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [users, setUsers] = useState<UserRoomData[]>([]);
    const [fonds, setFonds] = useState<Fond[]>([]);

    const handleReport = (glossId: string, report: Report) => {

    setGlossData(prev => {
    const next = prev.map(gloss =>
        gloss.glossId === glossId
            ? {
                ...gloss,
                reports: [
                    ...(gloss.reports ?? []),
                    report,
                ],
            }
            : gloss
    );

    console.log("UPDATED:", next.find(g => g.glossId === glossId)?.reports);

    return next;
});
};

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
        getAllFonds().then(setFonds);
    }, []);

    const handleFond = async (glossId: string) => {
        await updateGlossFond(glossId);
        const glosses = await getGlosses();
        setGlossData(glosses);
    };
    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === "currentUser"
        );

    return (
        <div className="feed">
            <pre>

                {JSON.stringify(glossData, null, 2)}

                </pre>
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
                fond={{
                    isPressed
                }}
                onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
            />
        </div>
    )
}
