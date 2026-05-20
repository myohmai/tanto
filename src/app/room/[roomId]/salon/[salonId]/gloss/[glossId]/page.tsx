"use client";
import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { Gloss } from "@/app/components/card/Gloss";
import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { ReplyList } from "@/app/components/list/ReplyList";
import { ReplyBar } from "@/app/components/buttons/ReplyBar";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";
import { toggleBlock } from "@/repositories/block";
import { getBlocksByUser } from "@/repositories/block";
import { toggleMute, getMutesByUser } from "@/repositories/mute";

import { canAccessRoom } from "@/app/logic/room/roomAccess";

import type { Report } from "@/app/types/report";
import { GlossData, SalonData, type RoomData, type UserRoomData, type Fond } from "@/app/types";




export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string; glossId: string; }> }) {
    const router = useRouter();
    const { roomId, salonId, glossId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [replyData, setReplyData] = useState<GlossData[]>([]);
    const [userRoomData, setUserRoomData] = useState<UserRoomData[]>([]);
    const [glossUser, setGlossUser] = useState<UserRoomData | null>(null);
    const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
    const [mutedSalonIds, setMutedSalonIds] = useState<Set<string>>(new Set());

    const [fonds, setFonds] = useState<Fond[]>([]);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

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
    const users = [...hostUser, ...userRoomData];


    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === "currentUser"
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

    const handleBlock = async (userId: string) => {
        await toggleBlock(userId, "currentUser");

        const glosses = await getProcessedGlosses();
        const gloss = glosses.find(g => g.glossId === glossId);

        setGlossData(gloss ? [gloss] : []);
        setReplyData(
            glosses.filter(g => g.replyToGlossId === glossId)
        );
    };

    useEffect(() => {
        getCurrentUserId().then((currentUserId) => {

            getRooms().then((rooms) => {
                const room = rooms.find(r => r.roomId === roomId);
                setRoomData(room ?? null);
            });

            getSalons().then((salons) => {
                setSalonData(
                    salons.find(s => s.salonId === salonId) ?? null
                );
            });

            getProcessedGlosses().then((glosses) => {
                const gloss = glosses.find(g => g.glossId === glossId);
                setGlossData(gloss ? [gloss] : []);
                setReplyData(
                    glosses.filter((g) => g.replyToGlossId === glossId)
                );

                if (!gloss) {
                    setGlossUser(null);
                    return;
                }

                getUserRoomData(currentUserId, roomId).then((users) => {
                    setUserRoomData(users);

                    const glossUser = users.find(
                        (x) =>
                            x.userId === gloss.userId &&
                            x.roomId === gloss.roomId
                    );

                    setGlossUser(glossUser ?? null);
                });

                getAllFonds().then(setFonds);
            });

            getUserRoomData(currentUserId, roomId).then((users) => {
                const currentUserRoom = users.find(
                    (user) =>
                        user.userId === currentUserId &&
                        user.roomId === roomId
                );

                setCurrentUserRoom(currentUserRoom ?? null);
            });

        });
    }, [roomId, salonId, glossId]);

        useEffect(() => {
        getCurrentUserId().then((uid) => {
            getBlocksByUser(uid).then((blocks) => {
                setBlockedUserIds(
                    new Set(blocks.map(b => b.targetUserId))
                );
            });
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

    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, "currentUser");
        const glosses = await getProcessedGlosses();
        const gloss = glosses.find((g) => g.glossId === glossId);
        setGlossData(gloss ? [gloss] : []);
    };
    
    const handleReply = async () => {
        const allowed = await canAccessRoom(roomId);
        if (!allowed) return;

        router.push(
            `/room/${roomId}/salon/${salonId}/gloss/${glossId}/reply`
        );
    };

    if (!roomData || !salonData || glossData.length === 0) return null;

    return (
        <div className="gloss-page">
            <div className="gloss-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData?.salonName ?? ""}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${roomId}`)}
                    onSalon={() => router.push(`/room/${roomId}/salon/${salonId}`)}
                    onPin={() => {}}
                    onEdit={() => router.push(`/room/${roomId}/salon/${salonId}/edit`)}
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
                    isHost={roomData.roomHost?.userId === currentUserRoom?.userId}
                    isMuted={mutedSalonIds.has(salonId)}
                />
            </div>
            <div className="gloss-page__scroll">
                <div className="gloss-page__scroll-wrap">
                    <Gloss
                        glossData={glossData[0]}
                        isInFeed={false}
                        isInRoom={false}
                        isInSalon={true}
                        user={{
                            iconUrl: users[0]?.iconUrl,
                            subIcon: users[0]?.subIcon
                        }}
                        room={{
                            iconUrl: roomData.roomIconUrl!,
                        }}
                        action={{
                            onRoom: () => router.push(`/room/${roomId}`),
                            onSalon: () => router.push(`/room/${roomId}/salon/${salonId}`),
                            onFond: handleFond,
                            onReply: handleReply,
                        }}
                        fond={{
                            isPressed
                        }}
                        onBlock={() => handleBlock(glossData[0].userId!)}
                        onSelect={(reason) => {handleReport(glossData[0].glossId, reason)}}
                        isBlocked={blockedUserIds.has(glossData[0].userId!)}
                        isOwn={glossData[0].userId === currentUserRoom?.userId}
                        lang="ja"
                    />
                    <ReplyList
                        glosses={replyData}
                        users={users}
                        room={{
                            iconUrl: roomData.roomIconUrl,
                            subIcon: undefined,
                        }}
                        fond={{
                            isPressed
                        }}
                        onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                        action={{
                            onRoom: (glossData) => router.push(`/room/${glossData.roomId}`),
                            onSalon: (glossData) => router.push(`/room/${glossData.roomId}/salon/${glossData.salonId}`),
                            onFond: handleFond,
                            onReply: handleReply,
                        }}
                        onBlock={handleBlock}
                        blockedUserIds={blockedUserIds}
                    />
                </div>
                <ReplyBar
                    userIconUrl={currentUserRoom?.iconUrl}
                    userSubIcon={currentUserRoom?.subIcon}
                    onClick={() =>
                        router.push(
                            `/room/${roomId}/salon/${salonId}/gloss/${glossId}/reply`
                        )
                    }
                />
            </div>
        </div>
    )
}
