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
    

    const enrichedRooms = calcRoomMeta(rooms, glosses, userRooms)
        .sort((a, b) => {
            if (!a.latestPostedAt && !b.latestPostedAt) return 0;
            if (!a.latestPostedAt) return 1;
            if (!b.latestPostedAt) return -1;
            return new Date(b.latestPostedAt).getTime() - new Date(a.latestPostedAt).getTime();
        });

    useEffect(() => {
        const load = async () => {
            const roomsData = await getRooms();
            setRooms(roomsData);

            try {
                const glossData = await getProcessedGlosses();
                setGlosses(glossData);
            } catch (e) {
                console.error('hallway gloss load error:', e);
            }

            try {
                const uid = await getCurrentUserId();
                const userRoomData = await getUserRoomsByUser(uid);
                setUserRooms(userRoomData);
            } catch {
                // user_rooms が取れなくても room 一覧は表示する
            }
        };

        load().catch((e) => console.error('hallway load error:', e));
    }, []);
    
    return (
        <div className="hallway">
            <div className="hallway__sticky">
                <HeadBar
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
