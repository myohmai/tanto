"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { GlossList } from "@/app/components/list/GlossList";

import { getRooms } from "@/repositories/room";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { getMutesByUser } from "@/repositories/mute";
import { getCurrentUserId } from "@/repositories/currentUser";

import { canAccessRoom } from "@/app/logic/room/roomAccess";
import { getEntities } from "@/repositories/entity";
import { getUserRoomEntitiesByUser } from "@/repositories/userRoomEntity";
import { getUserDisInterestsByUser } from "@/repositories/userDisInterest";
import { calcNotification, type NotificationResult } from "@/app/logic/report/calcNotification";

import type { Entity, UserRoomEntity, UserDisInterest } from "@/app/types/entity";
import type { Report } from "@/app/types/report";
import { GlossData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [users, setUsers] = useState<UserRoomData[]>([]);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [userId, setUserId] = useState<string>("");
    const [entities, setEntities] = useState<Entity[]>([]);
    const [userRoomEntities, setUserRoomEntities] = useState<UserRoomEntity[]>([]);
    const [userDisInterests, setUserDisInterests] = useState<UserDisInterest[]>([]);

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
    const handleBlock = async (targetUserId: string) => {
        await toggleBlock(targetUserId, userId);

        const glosses = await getProcessedGlosses();
        setGlossData(glosses);
    };
    const handleReply = async (gloss: GlossData) => {
        const allowed = await canAccessRoom(gloss.roomId);

        if (!allowed) return;

        router.push(
            `/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}/reply`
        );
    };

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setUserId(uid);

            const [glosses, mutes, rooms, users, fonds, blocks] =
                await Promise.all([
                    getProcessedGlosses(),
                    getMutesByUser(uid),
                    getRooms(),
                    getUserRoomData(uid, ""),
                    getAllFonds(),
                    getBlocksByUser(uid),
                ]);

            const filtered = glosses.filter(g =>
                !mutes.some(m =>
                    m.roomId === g.roomId ||
                    m.salonId === g.salonId
                )
            );

            setGlossData(filtered);
            setRooms(rooms);
            setUsers(users);
            setFonds(fonds);
            setBlockedUserIds(new Set(blocks.map(b => b.targetUserId)));

            setEntities(getEntities());
            setUserRoomEntities(getUserRoomEntitiesByUser(uid));
            setUserDisInterests(getUserDisInterestsByUser(uid));
        };

        load();
    }, []);

    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, userId);
        const glosses = await getProcessedGlosses();
        setGlossData(glosses);
    };
    const isPressed = (glossId: string) =>
        fonds.some(f => f.glossId === glossId && f.userId === userId);

    const glossNotifications = useMemo((): Record<string, NotificationResult | null> => {
        return Object.fromEntries(
            glossData.map(gloss => {
                const roomEntityIds = rooms.find(r => r.roomId === gloss.roomId)?.entityIds ?? [];
                return [
                    gloss.glossId,
                    gloss.reports?.length
                        ? calcNotification({
                            reports: gloss.reports,
                            roomId: gloss.roomId,
                            authorId: gloss.userId ?? "",
                            roomEntityIds,
                            entities,
                            userRoomEntities,
                            userDisInterests,
                        })
                        : null,
                ];
            })
        );
    }, [glossData, rooms, entities, userRoomEntities, userDisInterests]);

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
                action={{
                            onRoom: (glossData) => router.push(`/room/${glossData.roomId}`),
                            onSalon: (glossData) => router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}`),
                            onFond: handleFond,
                            onReply: handleReply,
                        }}
                onGlossClick={(glossId) => {
                    const gloss = glossData.find((gloss) => gloss.glossId === glossId);
                    if (!gloss) return;

                    router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`);
                }}
                fond={{
                    isPressed
                }}
                onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
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
    )
}
