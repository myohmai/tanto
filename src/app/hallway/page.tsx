"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeadBar } from "@/app/components/bar/HeadBar";
import { CreateOwnRoomButton } from "@/app/components/buttons/CreateOwnRoomButton";

import { RoomList } from "@/app/components/list/RoomList";

import { getRooms } from "@/repositories/room";

import { type RoomData } from "@/app/types";


export default function Page() {
    const router = useRouter();
    const [rooms, setRooms] = useState<RoomData[]>([]);

    useEffect(() => {
        getRooms().then((rooms) => {
                setRooms(rooms);
            }); 
    }, []);
    
    return (
        <div className="hallway">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <RoomList
                rooms={rooms}
                scope="feed"
                onRoom={(roomId) => router.push(`/room/${roomId}`)}
            />
            <CreateOwnRoomButton onClick={() => router.push("/room/new")}/>
        </div>
    )
}
