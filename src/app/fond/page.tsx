"use client";
import './page.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSideMenu } from "@/app/context/SideMenuContext";

import { HeadBar } from "@/app/components/bar/HeadBar";
import { GlossList } from "@/app/components/list/GlossList";

import { getRooms } from "@/repositories/room";
import { getGlossesByIds, submitRevaluation } from "@/repositories/gloss";
import { getFondsByUser, toggleFond, getAllFonds } from "@/repositories/fond";
import { getUserRoomsByUser } from "@/repositories/userRoom";
import { toggleBlock, getBlocksByUser } from "@/repositories/block";
import { getCurrentUserId } from "@/repositories/currentUser";
import { canAccessRoom } from "@/app/logic/room/roomAccess";
import { useGlossNotifications } from "@/app/hooks/useNotifications";

import type { Report } from "@/app/types/report";
import { type GlossData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const { openSideMenu } = useSideMenu();
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [users, setUsers] = useState<UserRoomData[]>([]);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [userId, setUserId] = useState<string>("");

    const loadFondedGlosses = async (uid: string) => {
        const fondRecords = await getFondsByUser(uid);
        const glossIds = fondRecords.map(f => f.glossId);
        return getGlossesByIds(glossIds);
    };

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setUserId(uid);

            const [glosses, rooms, users, fonds] = await Promise.all([
                loadFondedGlosses(uid),
                getRooms(),
                getUserRoomsByUser(uid),
                getAllFonds(),
            ]);

            setGlossData(glosses);
            setRooms(rooms);
            setUsers(users);
            setFonds(fonds);

            try {
                const blocks = await getBlocksByUser(uid);
                setBlockedUserIds(new Set(blocks.map((b: { targetUserId: string }) => b.targetUserId)));
            } catch {
                // blocks column may not exist yet
            }

        };

        load();
    }, []);

    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, userId);
        const glosses = await loadFondedGlosses(userId);
        setGlossData(glosses);
        const allFonds = await getAllFonds();
        setFonds(allFonds);
    };

    const handleBlock = async (targetUserId: string) => {
        await toggleBlock({ userId, targetUserId });
        const glosses = await loadFondedGlosses(userId);
        setGlossData(glosses);
    };

    const handleReply = async (gloss: GlossData) => {
        const allowed = await canAccessRoom(gloss.roomId);
        if (!allowed) return;
        router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}/reply`);
    };

    const handleReport = (glossId: string, report: Report) => {
        setGlossData(prev => prev.map(gloss =>
            gloss.glossId === glossId
                ? { ...gloss, reports: [...(gloss.reports ?? []), report] }
                : gloss
        ));
    };

    const isPressed = (glossId: string) =>
        fonds.some(f => f.glossId === glossId && f.userId === userId);

    // 通報判定は DB で集計した結果から決める(hooks/useNotifications.ts)
    const glossNotifications = useGlossNotifications(glossData);

    // 再評価を DB に保存し、集計結果で該当 Gloss を更新する
    const handleRevaluation = async (glossId: string, isAppropriate: boolean) => {
        try {
            const revaluation = await submitRevaluation(glossId, isAppropriate);
            setGlossData(prev => prev.map(g =>
                g.glossId === glossId ? { ...g, revaluation } : g
            ));
        } catch (e) {
            console.error('Failed to submit revaluation:', e);
        }
    };

    return (
        <div className="fond-page">
            <div className="fond-page__sticky">
                <HeadBar
                    onSideMenu={openSideMenu}
                />
            </div>
            {glossData.length === 0 ? (
                <div className="fond-page__empty">Fond した Gloss はまだありません</div>
            ) : (
                <GlossList
                    glosses={glossData}
                    scope="feed"
                    user={users}
                    room={rooms.map(room => ({
                        roomId: room.roomId,
                        iconUrl: room.roomIconUrl,
                        subIcon: undefined,
                    }))}
                    action={{
                        onRoom: (gloss) => router.push(`/room/${gloss.roomId}`),
                        onSalon: (gloss) => router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}`),
                        onFond: handleFond,
                        onReply: handleReply,
                    }}
                    onGlossClick={(glossId) => {
                        const gloss = glossData.find(g => g.glossId === glossId);
                        if (!gloss) return;
                        router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`);
                    }}
                    fond={{ isPressed }}
                    onSelect={(glossId, reason) => handleReport(glossId, reason)}
                    onBlock={(uid) => handleBlock(uid)}
                    blockedUserIds={blockedUserIds}
                    notifications={glossNotifications}
                    onRevaluation={{
                        onYes: (glossId) => handleRevaluation(glossId, true),
                        onNo: (glossId) => handleRevaluation(glossId, false),
                    }}
                />
            )}
        </div>
    );
}
