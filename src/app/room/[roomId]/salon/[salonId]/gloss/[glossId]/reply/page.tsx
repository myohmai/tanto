"use client";

import { useEffect, useState,use } from "react";
import { useRouter } from "next/navigation";

import { ReplyGloss } from "@/app/components/post/PostGloss";

import { getCurrentUserId } from "@/repositories/currentUser";
import { getGlossById, postGloss } from "@/repositories/gloss";
import { getRoomById } from "@/repositories/room";
import { getSalonsByRoom } from "@/repositories/salon";
import { getUserRoomByRoomId, getUserRoomsByUser } from "@/repositories/userRoom";

import type { GlossData, RoomData, SalonData, UserRoomData } from "@/app/types";

export default function Page({ params }: { params: Promise<{ roomId: string; salonId: string; glossId: string; }> }) {
    const router = useRouter();
    const { roomId, salonId, glossId } = use(params);

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [replyToGloss, setReplyToGloss] = useState<GlossData | null>(null);
    const [replyToUser, setReplyToUser] = useState<UserRoomData | null>(null);
    const [currentUserRoom, setCurrentUserRoom] =
        useState<UserRoomData | null>(null);

    useEffect(() => {
        const run = async () => {
            const currentUserId = await getCurrentUserId();
            const [room, salons, gloss, currentUserRoom] = await Promise.all([
                getRoomById(roomId),
                getSalonsByRoom(roomId),
                getGlossById(glossId),
                getUserRoomByRoomId(roomId, currentUserId),
            ]);

            const salon = salons.find(s => s.salonId === salonId) ?? null;
            const replyToUser = gloss?.userId
                ? await getUserRoomByRoomId(gloss.roomId, gloss.userId)
                : null;

            setRoomData(room);
            setSalonData(salon);
            setReplyToGloss(gloss);
            setReplyToUser(replyToUser ?? null);
            setCurrentUserRoom(currentUserRoom ?? null);
        };
        run();
    }, [roomId, salonId, glossId]);

    if (!roomData || !salonData || !replyToGloss || !currentUserRoom) return null;

    return (
        <ReplyGloss
            replyTo={{
                glossId: replyToGloss.glossId,
                glossContent: replyToGloss.content,
                iconUrl: replyToUser?.iconUrl ?? undefined,
                subIcon: replyToUser?.subIcon,
                userName: replyToUser?.userName ?? replyToGloss.userName ?? '',
            }}
            onCancel={() => router.back()}
            iconUrl={currentUserRoom.iconUrl ?? undefined}
            subIcon={currentUserRoom.subIcon}
            roomId={roomData.roomId}
            salonId={salonData.salonId ?? salonId}
            userId={currentUserRoom.userId}
            roomName={roomData.roomName}
            salonName={salonData.salonName}
            userName={currentUserRoom.userName ?? ''}
            onRoom={() => router.push(`/room/${roomId}`)}
            onSalon={() =>
                router.push(`/room/${roomId}/salon/${salonId}`)
            }
            onSelectFile={() => {}}
            onPost={async (payload: GlossData) => {
                await postGloss(payload);
                router.push(`/room/${roomId}/salon/${salonId}/gloss/${glossId}`);
            }}
            lang="ja"
        />
    );
}
