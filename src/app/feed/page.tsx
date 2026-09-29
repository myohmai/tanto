"use client";
import './page.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSideMenu } from "@/app/context/SideMenuContext";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { GlossList } from "@/app/components/list/GlossList";

import { getRooms } from "@/repositories/room";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomsByUser } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { getMutesByUser } from "@/repositories/mute";
import { getCurrentUserId } from "@/repositories/currentUser";

import { canAccessRoom } from "@/app/logic/room/roomAccess";
import { getRoomSubIcon } from "@/app/logic/room/roomSubIcon";
import { useGlossNotifications } from "@/app/hooks/useNotifications";

import type { Report } from "@/app/types/report";
import { GlossData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const { openSideMenu } = useSideMenu();
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [users, setUsers] = useState<UserRoomData[]>([]);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [userId, setUserId] = useState<string>("");

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
        await toggleBlock({ userId, targetUserId });

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
                    getUserRoomsByUser(uid),
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

    // 通報判定は DB で集計した結果から決める(hooks/useNotifications.ts)
    const glossNotifications = useGlossNotifications(glossData);

    return (
        <div className="feed">
            <div className="feed__sticky">
                <HeadBar
                    onSideMenu={openSideMenu}
                />
            </div>
            <GlossList
                glosses={glossData}
                scope="feed"
                user={users}
                room={rooms.map((room) => ({
                    roomId: room.roomId,
                    iconUrl: room.roomIconUrl,
                    subIcon: getRoomSubIcon(room, rooms),
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
