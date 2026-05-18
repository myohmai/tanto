"use client";
import { HeadBar } from "@/app/components/bar/HeadBar";

import { DashBoardTabBar, DashBoardTabType } from "@/app/components/bar/DashBoardTabBar";

import { DashboardUserNameBar } from "@/app/components/bar/DashboardUserNameBar";
import { CreateOwnRoomButton } from "@/app/components/buttons/CreateOwnRoomButton";

import { RoomList } from "@/app/components/list/RoomList";
import { GlossList } from "@/app/components/list/GlossList";


import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getRooms } from "@/repositories/room";
import { getUserRoomData } from "@/repositories/userRoom";
import { getCurrentUserId } from "@/repositories/currentUser";
import { toggleFond,  getAllFonds } from "@/repositories/fond";

import type { GlossData, RoomData, UserRoomData, Fond } from "@/app/types";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";


export default function Page() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<DashBoardTabType>('My Gloss');
    const [glosses, setGlosses] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [userRooms, setUserRooms] = useState<UserRoomData[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === currentUserId
        );
    const handleReport = (glossId: string, report: Report) => {
        setGlosses(prev =>
            prev.map(gloss =>
                gloss.glossId === glossId
                    ? {
                        ...gloss,
                        reports: [
                            ...(gloss.reports ?? []),
                            report,
                        ],
                    }
                    : gloss
            )
        );
    };

    useEffect(() => {
        Promise.all([getCurrentUserId(), getGlosses(), getRooms(), getUserRoomData(), getAllFonds()]).then(
            ([currentUserId, glosses, rooms, userRooms, fonds]) => {
                setCurrentUserId(currentUserId);
                setGlosses(glosses);
                setRooms(rooms);
                setUserRooms(userRooms);
                setFonds(fonds);
                setCurrentRoomId((currentRoomId) =>
                    currentRoomId ?? userRooms.find((userRoom) => userRoom.userId === currentUserId)?.roomId ?? userRooms[0]?.roomId ?? null
                );
            }
        );
    }, []);

    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, "currentUser");

        const [updatedGlosses, newFonds] = await Promise.all([
            getGlosses(),
            getAllFonds(),
        ]);

        setFonds(newFonds)
        setGlosses(updatedGlosses);
    };

    const currentRoom = useMemo(() => {
        if (currentRoomId) {
            const matchedCurrentUserRoom = userRooms.find(
                (userRoom) => userRoom.roomId === currentRoomId && userRoom.userId === currentUserId
            );
            if (matchedCurrentUserRoom) return matchedCurrentUserRoom;

            const matchedRoom = userRooms.find((userRoom) => userRoom.roomId === currentRoomId);
            if (matchedRoom) return matchedRoom;
        }

        return userRooms.find((userRoom) => userRoom.userId === currentUserId) ?? userRooms[0];
    }, [userRooms, currentRoomId, currentUserId]);

    const currentUserRooms = useMemo(() => {
        if (!currentUserId) return [];

        const joinedRooms = userRooms.filter((userRoom) => userRoom.userId === currentUserId);
        const joinedRoomIds = new Set(joinedRooms.map((userRoom) => userRoom.roomId));

        const ownedRooms = rooms
            .filter((room) => room.roomHost?.userId === currentUserId)
            .filter((room) => !joinedRoomIds.has(room.roomId))
            .map((room) => ({
                userId: currentUserId,
                roomId: room.roomId,
                roomName: room.roomName,
                iconUrl: room.roomIconUrl ?? undefined,
                subIcon: room.roomHost?.subIcon ?? null,
                userName: room.roomHost?.userName ?? "",
            }));

        return [...joinedRooms, ...ownedRooms];
    }, [currentUserId, userRooms, rooms]);

    const myGlosses = useMemo(() => {
        if (!currentUserId) return [];
        return glosses.filter((gloss) => gloss.userId === currentUserId);
    }, [currentUserId, glosses]);

    const joinedRooms = useMemo(() => {
        const joinedRoomIds = new Set(currentUserRooms.map((userRoom) => userRoom.roomId));
        return rooms.filter((room) => joinedRoomIds.has(room.roomId));
    }, [currentUserRooms, rooms]);

    const ownedRooms = useMemo(() => {
        if (!currentUserId) return [];
        return rooms.filter((room) => room.roomHost?.userId === currentUserId);
    }, [currentUserId, rooms]);


    return(
        <div className="dashboard">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            {currentRoom && (
                <DashboardUserNameBar
                    list={currentUserRooms}
                    currentRoom={currentRoom}
                    onChange={(roomId) => setCurrentRoomId(roomId)}
                />
            )}
            <DashBoardTabBar
                selectedTab={selectedTab}
                onChange={(value) => setSelectedTab(value)}
            />
            {selectedTab === 'Joined Room' && (
                <RoomList
                    rooms={joinedRooms}
                    scope="dashboard"
                    users={currentUserRooms}
                    onRoom={(roomId) => router.push(`/room/${roomId}`)}
                />
            )}
            {selectedTab === 'Owned Room' && (
                <div className="dashboard__own-room">
                    <RoomList
                        rooms={ownedRooms}
                        scope="dashboard"
                        onRoom={(roomId) => router.push(`/room/${roomId}`)}
                    />
                    <CreateOwnRoomButton onClick={() => {}}/>
                </div>
            )}
            {selectedTab === 'My Gloss' && (
                <GlossList
                    glosses={myGlosses}
                    scope="feed"
                    user={currentUserRooms}
                    room={rooms.map((room) => ({
                        roomId: room.roomId,
                        iconUrl: room.roomIconUrl,
                        subIcon: undefined,
                    }))}
                    onFond={handleFond}
                    fond={{isPressed}}
                    onGlossClick={(glossId) => {
                        const gloss = glosses.find((gloss) => gloss.glossId === glossId);
                        if (!gloss) return;

                        router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`);
                    }}
                    onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                />
            )}
        </div>
    )
}