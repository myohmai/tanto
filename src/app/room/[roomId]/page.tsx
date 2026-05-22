"use client";

import { useEffect, useState, useRef, use, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { RoomInfo } from "@/app/components/content/RoomInfo";
import { RoomTopBar } from "@/app/components/bar/RoomTopBar";
import { RoomTabBar, TabType } from "@/app/components/bar/RoomTabBar";

import { GlossList } from "@/app/components/list/GlossList";
import { SalonList } from "@/app/components/list/SalonList";

import { TurnTableMusicList } from "@/app/components/list/TurnTableMusicList";
import { TurnTableVideoList } from "@/app/components/list/TurnTableVideoList/TurnTableVideoList";

import {
    TurnTableMediaTab,
    TurnTableMediaType,
} from "@/app/components/bar/TurnTableMediaTab";

import { CreateSalonButton } from "@/app/components/buttons/CreateSalonButton";
import { AddTurnTableButton } from "@/app/components/buttons/AddTurnTableButton";
import { CertificationBar } from "@/app/components/bar/CertificationBar";

import { getRooms } from "@/repositories/room";
import { getTurntables } from "@/repositories/turntable";
import { getSalons } from "@/repositories/salon";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomData, getUserRoomsByUser, getUsersByRoomId } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { toggleMute, getMutesByUser  } from "@/repositories/mute";
import { getCurrentUserId } from "@/repositories/currentUser";

import { calcRoomMeta } from "@/app/logic/room/calcMeta";
import { calcSalonMeta } from "@/app/logic/salon/calcMeta";

import { canAccessRoom } from "@/app/logic/room/roomAccess";

import { isJoined } from "@/repositories/userRoom";
import { leaveRoom } from "@/repositories/userRoom";
import { removeUserRoomEntities } from "@/repositories/userRoomEntity";
import { getUserRoomEntitiesByUser } from "@/repositories/userRoomEntity";
import { getEntities } from "@/repositories/entity";
import { getUserDisInterestsByUser } from "@/repositories/userDisInterest";
import { calcNotification, type NotificationResult } from "@/app/logic/report/calcNotification";
import { getPendingCount } from "@/repositories/songRequest";

import type { Entity, UserRoomEntity, UserDisInterest } from "@/app/types/entity";
import type { Report } from "@/app/types/report";
import { GlossData, SalonData, type RoomData, type TurnTableData, type UserRoomData, type Fond } from "@/app/types";


export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        getCurrentUserId().then(setUserId);
    }, []);
    
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    const [turntableData, setTurntableData] =
        useState<TurnTableData[]>([]);

    const [salonData, setSalonData] = useState<SalonData[]>([]);

    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [glossUsers, setGlossUsers] = useState<UserRoomData[]>([]);

    const [allRooms, setAllRooms] = useState<RoomData[]>([]);
    const [userRooms, setUserRooms] = useState<UserRoomData[]>([]);

    const [fonds, setFonds] = useState<Fond[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [userRoomEntities, setUserRoomEntities] = useState<UserRoomEntity[]>([]);
    const [userDisInterests, setUserDisInterests] = useState<UserDisInterest[]>([]);
    const hostUser = roomData?.roomHost
        ? [{
            userId: roomData.roomHost.userId,
            userName: roomData.roomHost.userName,
            iconUrl: roomData.roomHost.iconUrl,
            subIcon: roomData.roomHost.subIcon,
            roomId: roomId,
            roomName: roomData.roomName,
        }]
        : [];
    const users = [...hostUser, ...glossUsers];


    const [pendingCount, setPendingCount] = useState(0);
    const [isEntered, setIsEntered] = useState(false);

    const [showTopBar, setShowTopBar] = useState(false);
    const isMounted = true;
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [mutedRoomIds, setMutedRoomIds] = useState<Set<string>>(new Set());

    const [selectedTab, setSelectedTab] =
        useState<TabType>("Gloss");

    const [selectMediaTab, setSelectMediaTab] =
        useState<TurnTableMediaType>("Music");
        

    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === userId
        );

    const handleReport = (glossId: string, report: Report) => {
        setGlossData(prev =>
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
    const handleBlock = async (targetId: string) => {
        if (!userId) return;
        await toggleBlock({ userId, targetUserId: targetId });

        const glosses = await getProcessedGlosses();
        setGlossData(glosses.filter(g => g.roomId === roomId));
    };

    const handleEnter = async () => {
        if (!roomData || !userId) return;

        const isHost = roomData.roomHost?.userId === userId;

        if (isHost) {
            router.push(`/room/${roomId}`);
            return; 
        }

        if (isEntered) {
            await leaveRoom(roomId, userId);
            removeUserRoomEntities(userId, roomId);
            router.refresh();
            return;
        }

        const ok = await canAccessRoom(roomId);

        if (!ok) {
            router.push(`/room/${roomId}/nickname`);
            return;
        }
    };
    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((room) => room.roomId === roomId);
            setRoomData(room ?? null);
        });
    }, [roomId]);

    useEffect(() => {
        getTurntables().then((turntables) => {
            setTurntableData(turntables.filter((turntable) => turntable.roomId === roomId));
        });
    }, [roomId]);

    useEffect(() => {
        if (!roomData || roomData.roomHost) return;
        getPendingCount(roomId).then(setPendingCount);
    }, [roomId, roomData]);

    useEffect(() => {
        getSalons().then((salons) => {
            setSalonData(salons.filter((salon) => salon.roomId === roomId));
        });
    }, [roomId]);

    useEffect(() => {
        getProcessedGlosses().then((glosses) => {
            setGlossData(glosses.filter((gloss) => gloss.roomId === roomId));
        });
    }, [roomId]);

    useEffect(() => {
        getAllFonds().then(setFonds);
    }, []);

    useEffect(() => {
        if (!userId) return;
        getBlocksByUser(userId).then((blocks) => {
            setBlockedUserIds(
                new Set(blocks.map(b => b.targetUserId))
            );
        });
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        if (roomData?.roomHost?.userId === userId) {
            setIsEntered(true);
            return;
        }
        isJoined(roomId, userId).then(setIsEntered);
    }, [roomId, userId, roomData]);

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();

            const [rooms, glosses, userRooms] = await Promise.all([
                getRooms(),
                getProcessedGlosses(),
                getUserRoomsByUser(uid),
            ]);

            const enriched = calcRoomMeta(rooms, glosses, userRooms);

            setAllRooms(enriched);

            const current = enriched.find(r => r.roomId === roomId);
            setRoomData(current ?? null);
        };

        load();
    }, [roomId]);

    useEffect(() => {
        const load = async () => {
            const [salons, glosses] = await Promise.all([
                getSalons(),
                getProcessedGlosses(),
            ]);

            const filtered = salons.filter(s => s.roomId === roomId);

            const enriched = calcSalonMeta(filtered, glosses);

            setSalonData(enriched);
        };

        load();
    }, [roomId]);
    

    const handleFond = async (glossId: string) => {
        if (!userId) return;
        await toggleFond(glossId, userId);

        const [glosses, newFonds] = await Promise.all([
            getProcessedGlosses(),
            getAllFonds(),
        ]);

        setGlossData(glosses.filter(g => g.roomId === roomId));
        setFonds(newFonds);
    };

    useEffect(() => {
    getCurrentUserId().then((userId) => {
        getUserRoomData(userId, roomId).then((users) => {
            setGlossUsers(users);
        });
    });
}, [roomId]);

    useEffect(() => {
        if (!userId) return;
        getMutesByUser(userId).then((mutes) => {
            setMutedRoomIds(
                new Set(
                    mutes
                        .map(m => m.roomId)
                        .filter((id): id is string => id !== undefined)
                )
            );
        });
    }, [userId]);

    useEffect(() => {
        const load = async () => {
            if (!userId) return;
            const uid = userId;
            const [entities, userRoomEntities, userDisInterests] = await Promise.all([
                getEntities(),
                getUserRoomEntitiesByUser(uid),
                getUserDisInterestsByUser(uid),
            ]);
            setEntities(entities);
            setUserRoomEntities(userRoomEntities);
            setUserDisInterests(userDisInterests);
        };
        load();
    }, [userId]);

    const glossNotifications = useMemo((): Record<string, NotificationResult | null> => {
        if (!roomData) return {};
        return Object.fromEntries(
            glossData.map(gloss => [
                gloss.glossId,
                gloss.reports?.length
                    ? calcNotification({
                        reports: gloss.reports,
                        roomId: gloss.roomId,
                        authorId: gloss.userId ?? "",
                        roomEntityIds: roomData.entityIds,
                        entities,
                        userRoomEntities,
                        userDisInterests,
                    })
                    : null,
            ])
        );
    }, [glossData, roomData, entities, userRoomEntities, userDisInterests]);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const target = sentinelRef.current;

        const observer = new IntersectionObserver(([entry]) => {
            setShowTopBar(!entry.isIntersecting);
        });

        observer.observe(target);

        return () => observer.disconnect();
    }, [roomData]);

    if (!roomData || !isMounted) return null;

    return (
        <div className="room-top">
                <RoomInfo
                    roomData={roomData}
                    subIcon={undefined}
                    onSearch={() => {}}
                    onEdit={
                        () => router.push(`/room/${roomId}/edit`)
                    }
                    onEnter={handleEnter}
                    isEntered={isEntered}
                    onShare={() => {}}
                    onMute={async () => {
                        if (!userId) return;
                        await toggleMute({
                            userId,
                            roomId: roomId,
                        });
                        const glosses = await getProcessedGlosses();
                        setGlossData(glosses.filter(g => g.roomId === roomId));
                    }}
                    onSelect={() => {}}
                    isOwn={roomData?.roomHost?.userId === userId}
                    isMuted={mutedRoomIds.has(roomId)}
                />
            <div ref={sentinelRef} style={{ height: "1px" }} />
            <div className="room-top__sticky">
                {isMounted && showTopBar && ( 
                    <RoomTopBar
                        roomName={roomData?.roomName ?? ''}
                        onBack={() => router.back()}
                        onEnter={handleEnter}
                        isEntered={isEntered}
                        onRoom={() => router.push(`/room/${roomData.roomId}`)}
                    />
                )}

                <RoomTabBar
                    selectedTab={selectedTab}
                    onChange={(value) => setSelectedTab(value)}
                />
            </div>

            {roomData.roomVisibility === "private" && !isEntered ? (
                <div className="room-top__private text-color-secondary">
                    This room is private
                </div>
            ) : (
                <>
                    {selectedTab === "Gloss" && (
                        <div style={{ height: "2000px" }}>
                            <GlossList
                                glosses={glossData}
                                scope="room"
                                user={users}
                                room={{
                                    iconUrl: roomData.roomIconUrl,
                                    subIcon: undefined,
                                }}
                                action={{
                                    onRoom: (glossData) => router.push(`/room/${glossData.roomId}`),
                                    onSalon: (glossData) => router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}`),
                                    onFond: handleFond,
                                    onReply: (glossData) => {
                                        if (!isEntered) return;
                                        router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}/gloss/${glossData.glossId}/reply`)
                                    },
                                }}
                                fond={{
                                    isPressed
                                }}
                                onGlossClick={(glossId) => {
                                    const gloss = glossData.find(g => g.glossId === glossId);
                                    if (!gloss) return;
                                    router.push(`/room/${roomId}/salon/${gloss.salonId}/gloss/${glossId}`);
                                }}
                                onSelect={(glossId, reason) => handleReport(glossId, reason)}
                                onBlock={(userId) => handleBlock(userId)}
                                blockedUserIds={blockedUserIds}
                                notifications={glossNotifications}
                                onRevaluation={{
                                    onYes: (glossId) => {
                                        setGlossData(prev => prev.map(g =>
                                            g.glossId === glossId
                                                ? { ...g, revaluation: { yesCount: (g.revaluation?.yesCount ?? 0) + 1, noCount: g.revaluation?.noCount ?? 0 } }
                                                : g
                                        ));
                                    },
                                    onNo: (glossId) => {
                                        setGlossData(prev => prev.map(g =>
                                            g.glossId === glossId
                                                ? { ...g, revaluation: { yesCount: g.revaluation?.yesCount ?? 0, noCount: (g.revaluation?.noCount ?? 0) + 1 } }
                                                : g
                                        ));
                                    },
                                }}
                            />
                        </div>
                    )}

                    {selectedTab === "Salon" && (
                        <div className="room-top__salon">
                            <SalonList
                                salons={salonData}
                                onClick={(salon) =>
                                    router.push(`/room/${roomData.roomId}/salon/${salon.salonId}`)}/>
                            {isEntered && (!roomData.hostCreateSalon || roomData.roomHost?.userId === userId) && (
                                <CreateSalonButton
                                    onClick={() => router.push(`/room/${roomId}/salon/new`)}
                                />
                            )}
                        </div>
                    )}

                    {selectedTab === "Turn Table" && (
                        <div className="room-top__turn-table">

                            {!roomData.roomHost && pendingCount > 0 && (
                                <CertificationBar
                                    onClick={() => router.push(`/room/${roomId}/turntable/pending`)}
                                />
                            )}

                            <TurnTableMediaTab
                                selectedTab={selectMediaTab}
                                onChange={(value) => setSelectMediaTab(value)}
                            />

                            {selectMediaTab === "Music" && (
                                <TurnTableMusicList
                                    turntables={turntableData}
                                />
                            )}

                            {selectMediaTab === "Video" && (
                                <TurnTableVideoList
                                    turntables={turntableData}
                                />
                            )}

                            {isEntered && (!roomData.roomHost || roomData.roomHost.userId === userId) && (
                                <AddTurnTableButton onClick={() => {}} />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
