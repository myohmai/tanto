"use client";
import './page.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSideMenu } from "@/app/context/SideMenuContext";
import { HeadBar } from "@/app/components/bar/HeadBar";
import { CreateOwnRoomButton } from "@/app/components/buttons/CreateOwnRoomButton";

import { calcRoomMeta } from "@/app/logic/room/calcMeta";

import { RoomList } from "@/app/components/list/RoomList";

import { getRooms } from "@/repositories/room";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomsByUser } from "@/repositories/userRoom";
import { getCurrentUserId } from "@/repositories/currentUser";

import { type RoomData } from "@/app/types";


export default function Page() {
    const router = useRouter();
    const { openSideMenu } = useSideMenu();
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [glosses, setGlosses] = useState<any[]>([]);
    const [userRooms, setUserRooms] = useState<any[]>([]);
    

    const enrichedRooms = calcRoomMeta(rooms, glosses, userRooms);

    useEffect(() => {
    const load = async () => {
        const uid = await getCurrentUserId();

        const [roomsData, glossData, userRoomData] = await Promise.all([
            getRooms(),
            getProcessedGlosses(),
            getUserRoomsByUser(uid),
        ]);

        setRooms(roomsData);
        setGlosses(glossData);
        setUserRooms(userRoomData);
    };

    load();
}, []);
    
    return (
        <div className="hallway">
            <div className="hallway__sticky">
                <HeadBar
                    onReload={() => {}}
                    onSearch={() => {}}
                    onSideMenu={openSideMenu}
                />
            </div>
            <RoomList
                rooms={enrichedRooms}
                scope="feed"
                onRoom={(roomId) => router.push(`/room/${roomId}`)}
            />
            <CreateOwnRoomButton onClick={() => router.push("/room/new")}/>
        </div>
    )
}
