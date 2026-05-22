"use client";
import { useEffect, useMemo, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicBoxBar } from "@/app/components/bar/TopicBoxBar";

import { getCurrentUserId } from "@/repositories/currentUser";

import { GlossList } from "@/app/components/list/GlossList";

import { AddGlossButton } from "@/app/components/buttons/AddGlossButton";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { toggleMute, getMutesByUser } from "@/repositories/mute";

import { canAccessRoom } from "@/app/logic/room/roomAccess";
import { getEntities } from "@/repositories/entity";
import { getUserRoomEntitiesByUser } from "@/repositories/userRoomEntity";
import { getUserDisInterestsByUser } from "@/repositories/userDisInterest";
import { calcNotification, type NotificationResult } from "@/app/logic/report/calcNotification";

import type { Entity, UserRoomEntity, UserDisInterest } from "@/app/types/entity";
import type { Report } from "@/app/types/report";
import { GlossData, SalonData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string }> }) {
    const router = useRouter();
    const { roomId, salonId } = use(params);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [isEntered, setIsEntered] = useState(false);

    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [glossUsers, setGlossUsers] = useState<UserRoomData[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [mutedSalonIds, setMutedSalonIds] = useState<Set<string>>(new Set());
    const [entities, setEntities] = useState<Entity[]>([]);
    const [userRoomEntities, setUserRoomEntities] = useState<UserRoomEntity[]>([]);
    const [userDisInterests, setUserDisInterests] = useState<UserDisInterest[]>([]);
    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === currentUserId
        );

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
    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, "currentUser");

        const [glosses, newFonds] = await Promise.all([
            getProcessedGlosses(),
            getAllFonds(),
        ]);

        setGlossData(glosses.filter(g => g.salonId === salonId));
        setFonds(newFonds);
    }
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
    const handleBlock = async (userId: string) => {
        await toggleBlock(userId, "currentUser");

        const glosses = await getProcessedGlosses();
        setGlossData(glosses.filter(g => g.salonId === salonId));
    };
    useEffect(() => {
    getRooms().then((rooms) => {
        const room = rooms.find(r => r.roomId === roomId);
        setRoomData(room ?? null);
    });

    getSalons().then((salons) => {
        const salon = salons.find(
            s => s.roomId === roomId && s.salonId === salonId
        );
        setSalonData(salon ?? null);
    });

    getProcessedGlosses().then((glosses) => {
            const filtered = glosses.filter(g => g.salonId === salonId);
            setGlossData(filtered);
        });
    }, [salonId, roomId]);
    
    
    useEffect(() => {
        getAllFonds().then(setFonds);
    }, []);

    useEffect(() => {
        getCurrentUserId().then((userId) => {
            getUserRoomData(userId, roomId).then((users) => {
                setGlossUsers(users);
            });
        });
    }, [roomId]);

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setCurrentUserId(uid);
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
    }, []);

    useEffect(() => {
        getBlocksByUser("currentUser").then((blocks) => {
            setBlockedUserIds(
                new Set(blocks.map(b => b.targetUserId))
            );
        });
    }, []);
    useEffect(() => {
        getMutesByUser("currentUser").then((mutes) => {
            setMutedSalonIds(
                new Set(
                    mutes
                        .filter(m => m.salonId)
                        .map(m => m.salonId!)
                )
            );
        });
    }, []);

    useEffect(() => {
    const run = async () => {
        const ok = await canAccessRoom(
            roomId);
        setIsEntered(ok);
    };

    run();
}, [roomId]);

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

    if (!roomData || !salonData) return null;

    const isHost = roomData.roomHost?.userId === currentUserId;

    return (
        <div className="salon-page">
            <div className="salon-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData.salonName}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${roomId}`)}
                    onSalon={() => router.refresh()}
                    onPin={() => {}}
                    onEdit={() =>
                        router.push(`/room/${roomId}/salon/${salonId}/edit`)
                    }
                    onMute={async () => {
                            await toggleMute({
                                userId: "currentUser",
                                salonId: salonId,
                            });

                            const mutes = await getMutesByUser("currentUser");

                            setMutedSalonIds(
                                new Set(
                                    mutes
                                        .filter(m => m.salonId)
                                        .map(m => m.salonId!)
                                )
                            );

                            const glosses = await getProcessedGlosses();
                            setGlossData(glosses.filter(g => g.salonId === salonId));
                        }}
                    isHost={isHost}
                    isMuted={mutedSalonIds.has(salonId)}
                />
            </div>
            {salonData.isTopicBox && (
                <TopicBoxBar
                    isInSalon={true}
                    isHost={isHost}
                    onView={() => router.push(`/room/${roomId}/salon/${salonId}/topic`)}
                    onWhisper={() => {
                        if (!isEntered) return;
                        router.push(`/room/${roomId}/salon/${salonId}/topic/new`)}}
                />
            )}
            <div className="salon-page__wrapper">
                <GlossList
                    glosses={glossData}
                    scope="salon"
                    user={users}
                    room={{
                        iconUrl: roomData.roomIconUrl,
                        subIcon: undefined,
                    }}
                    action={{
                            onRoom: (glossData) => router.push(`/room/${glossData.roomId}`),
                            onSalon: (glossData) => router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}`),
                            onFond: handleFond,
                            onReply: (gloss) => {                                    
                                if (!isEntered) return;
                                router.push(
                                    `/room/${roomId}/salon/${salonId}/gloss/${gloss.glossId}/reply`
                                );}
                        }}
                    fond={{
                        isPressed
                    }}
                    onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                    onGlossClick={(glossId) => {
                        router.push(`/room/${roomId}/salon/${salonId}/gloss/${glossId}`);
                    }}
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
                {isEntered && (
                    <AddGlossButton onClick={() => router.push(`/room/${roomId}/salon/${salonId}/gloss/new`)} />
                )}
            </div>
        </div>
    )
}
