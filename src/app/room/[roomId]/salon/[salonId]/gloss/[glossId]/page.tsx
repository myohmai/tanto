"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { Gloss } from "@/app/components/card/Gloss";
import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { ReplyList } from "@/app/components/list/ReplyList";
import { ReplyBar } from "@/app/components/buttons/ReplyBar";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";

import { GlossData, SalonData, type RoomData, type UserRoomData, type Fond } from "@/app/types";




export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string; glossId: string; }>();
    
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [replyData, setReplyData] = useState<GlossData[]>([]);
    const [userRoomData, setUserRoomData] = useState<UserRoomData[]>([]);
    const [glossUser, setGlossUser] = useState<UserRoomData | null>(null);

    const [fonds, setFonds] = useState<Fond[]>([]);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

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

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find(r => r.roomId === params.roomId);
            setRoomData(room ?? null);
        });

        getSalons().then((salons) => {
            setSalonData(
                salons.find(s => s.salonId === params.salonId) ?? null
            );
        });

        getGlosses().then((glosses) => {
            const gloss = glosses.find(g => g.glossId === params.glossId);
            setGlossData(gloss ? [gloss] : []);
            setReplyData(
                glosses.filter((gloss) => gloss.replyToGlossId === params.glossId)
            );

            if (!gloss) {
                setGlossUser(null);
                return;
            }

            getUserRoomData().then((users) => {
                setUserRoomData(users);
                const glossUser = users.find(
                    (x) => x.userId === gloss.userId && x.roomId === gloss.roomId
                );
                setGlossUser(glossUser ?? null);
            });
            getAllFonds().then(setFonds);
        });
        

        Promise.all([getCurrentUserId(), getUserRoomData()]).then(
            ([currentUserId, users]) => {
                const currentUserRoom = users.find(
                    (user) =>
                        user.userId === currentUserId &&
                        user.roomId === params.roomId
                );

                setCurrentUserRoom(currentUserRoom ?? null);
            }
        );
    }, [params]);

    const handleFond = async (glossId: string) => {
        await updateGlossFond(glossId);
        const glosses = await getGlosses();
        const gloss = glosses.find((g) => g.glossId === glossId);
        setGlossData(gloss ? [gloss] : []);
    };

    if (!roomData || !salonData || glossData.length === 0) return null;

    return (
        <div className="gloss-page">
            <div className="gloss-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData?.salonName ?? ""}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${params.roomId}`)}
                    onSalon={() => router.push(`/room/${params.roomId}/salon/${params.salonId}`)}
                    onPin={() => {}}
                    onEdit={() => {}}
                    onMute={() => {}}
                    isHost={false}
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
                            iconUrl: glossUser?.iconUrl,
                            subIcon: glossUser?.subIcon
                        }}
                        room={{
                            iconUrl: roomData.roomIconUrl!,
                        }}
                        action={{
                            onRoom: () => {},
                            onSalon: () => {},
                            onFond: handleFond,
                            onReply: () => {},
                        }}
                        fond={{
                            isPressed
                        }}
                        onSelect={(reason) => {handleReport(glossData[0].glossId, reason)}}
                        lang="ja"
                    />
                    <ReplyList
                        glosses={replyData}
                        users={userRoomData}
                        room={{
                            iconUrl: roomData.roomIconUrl,
                            subIcon: undefined,
                        }}
                        fond={{
                            isPressed
                        }}
                        onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                        onFond={handleFond}
                    />
                </div>
                <ReplyBar
                    userIconUrl={currentUserRoom?.iconUrl}
                    userSubIcon={currentUserRoom?.subIcon}
                    onClick={() =>
                        router.push(
                            `/room/${params.roomId}/salon/${params.salonId}/gloss/${params.glossId}/reply`
                        )
                    }
                />
            </div>
        </div>
    )
}
