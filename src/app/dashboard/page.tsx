"use client";
import './page.scss';
import { HeadBar } from "@/app/components/bar/HeadBar";

import { DashBoardTabBar, DashBoardTabType } from "@/app/components/bar/DashBoardTabBar";

import { DashboardUserNameBar } from "@/app/components/bar/DashboardUserNameBar";
import { CreateOwnRoomButton } from "@/app/components/buttons/CreateOwnRoomButton";

import { RoomList } from "@/app/components/list/RoomList";
import { GlossList } from "@/app/components/list/GlossList";


import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getRooms } from "@/repositories/room";
import { getUserRoomsByUser } from "@/repositories/userRoom";
import { getCurrentUserId } from "@/repositories/currentUser";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { submitRevaluation } from "@/repositories/gloss";

import { canAccessRoom } from "@/app/logic/room/roomAccess";
import { useGlossNotifications } from "@/app/hooks/useNotifications";

import type { Report } from "@/app/types/report";
import type { GlossData, RoomData, UserRoomData, Fond } from "@/app/types";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSideMenu } from "@/app/context/SideMenuContext";


export default function Page() {
    const router = useRouter();
    const { openSideMenu } = useSideMenu();
    const [selectedTab, setSelectedTab] = useState<DashBoardTabType>('My Gloss');
    const [glosses, setGlosses] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [userRooms, setUserRooms] = useState<UserRoomData[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

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
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
    }, [mounted]);


    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setCurrentUserId(uid);

            const [glosses, rooms, userRooms, fonds, blocks] =
                await Promise.all([
                    getProcessedGlosses(),
                    getRooms(),
                    getUserRoomsByUser(uid),
                    getAllFonds(),
                    getBlocksByUser(uid),
                ]);

            setGlosses(glosses);
            setRooms(rooms);
            setUserRooms(userRooms);
            setFonds(fonds);
            setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));


            const initialRoomId =
                userRooms.find(r => r.userId === uid)?.roomId ??
                userRooms[0]?.roomId ??
                null;

            setCurrentRoomId(initialRoomId);
        };

        load();
    }, []);

    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, currentUserId ?? await getCurrentUserId());

        const [updatedGlosses, newFonds] = await Promise.all([
            getProcessedGlosses(),
            getAllFonds(),
        ]);

        setFonds(newFonds)
        setGlosses(updatedGlosses);
    };
    const handleBlock = (targetUserId: string) => {
        toggleBlock({ userId: currentUserId ?? '', targetUserId });

        getBlocksByUser("user_1").then((blocks) => {
            setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));
        });
    };
    const handleReply = async (gloss: GlossData) => {
        const allowed = await canAccessRoom(gloss.roomId);

        if (!allowed) return;

        router.push(
            `/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}/reply`
        );
    };

    

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

    const currentRoom = useMemo(() => {
            if (!currentRoomId) return null;

            return currentUserRooms.find(
                r => r.roomId === currentRoomId
            ) ?? null;
        }, [currentUserRooms, currentRoomId]);

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

    const filteredGlosses = useMemo(() => {
        if (!currentRoomId) return myGlosses;
        return myGlosses.filter((g) => g.roomId === currentRoomId);
    }, [myGlosses, currentRoomId]);

    // 通報判定は DB で集計した結果から決める(hooks/useNotifications.ts)
    const glossNotifications = useGlossNotifications(filteredGlosses);


    // 再評価を DB に保存し、集計結果で該当 Gloss を更新する
    const handleRevaluation = async (glossId: string, isAppropriate: boolean) => {
        try {
            const revaluation = await submitRevaluation(glossId, isAppropriate);
            setGlosses(prev => prev.map(g =>
                g.glossId === glossId ? { ...g, revaluation } : g
            ));
        } catch (e) {
            console.error('Failed to submit revaluation:', e);
        }
    };

    return(
        <div className="dashboard">
            <div className="dashboard__sticky">
                <HeadBar
                    onSideMenu={openSideMenu}
                />
            </div>
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
                    onEdit={(roomId) => {
                        const room = rooms.find(r => r.roomId === roomId);

                        if (room?.roomHost?.userId === currentUserId) {
                            router.push(`/room/${roomId}/edit`);
                        } else {
                            router.push(`/room/${roomId}/editnickname`);
                        }
                    }}
                />
            )}
            {selectedTab === 'Owned Room' && (
                <div className="dashboard__own-room">
                    <RoomList
                        rooms={ownedRooms}
                        scope="dashboard"
                        onRoom={(roomId) => router.push(`/room/${roomId}`)}
                        onEdit={(roomId) => {
                            const room = rooms.find(r => r.roomId === roomId);

                            if (room?.roomHost?.userId === currentUserId) {
                                router.push(`/room/${roomId}/edit`);
                            } else {
                                router.push(`/room/${roomId}/editnickname`);
                            }
                        }}
                    />
                    <CreateOwnRoomButton onClick={() => {}}/>
                </div>
            )}
            {selectedTab === 'My Gloss' && (
                <GlossList
                    glosses={filteredGlosses}
                    scope="feed"
                    user={currentUserRooms}
                    room={rooms.map((room) => ({
                        roomId: room.roomId,
                        iconUrl: room.roomIconUrl,
                        subIcon: undefined,
                    }))}
                    action={{
                            onRoom: (glossData) => router.push(`/room/${glossData.roomId}`),
                            onSalon: (glossData) => router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}`),
                            onFond: handleFond,
                            onReply: handleReply,
                        }}
                    fond={{isPressed}}
                    onGlossClick={(glossId) => {
                        const gloss = glosses.find((gloss) => gloss.glossId === glossId);
                        if (!gloss) return;

                        router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`);
                    }}
                    onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                    onBlock={handleBlock}
                    blockedUserIds={blockedUserIds}
                    notifications={glossNotifications}
                    onRevaluation={{
                        onYes: (glossId) => handleRevaluation(glossId, true),
                        onNo: (glossId) => handleRevaluation(glossId, false),
                    }}
                />
            )}
        </div>
    )
}