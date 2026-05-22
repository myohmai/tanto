"use client";
import { EnterPrivateRoomKeyword } from "@/app/components/room/EnterPrivateRoom";
import { EnterPrivateRoomQuiz } from "@/app/components/room/EnterPrivateRoom";
import { getRooms } from "@/repositories/room";

export default async function Page({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const rooms = await getRooms();
    const room = rooms.find(r => r.roomId === roomId);

    if (!room) return null;

    if (room.roomEntrySetting === "keyword") {
        return (
            <EnterPrivateRoomKeyword
                roomName={room.roomName}
                roomIconUrl={room.roomIconUrl}
                bannerUrl={room.roomBannerUrl}
                roomKeyWord={room.roomKeyWord}
                roomKeyWordHint={room.roomKeyWordHint}
                onEnter={() => {}}
            />
        );
    }

    if (room.roomEntrySetting === "quiz") {
        return (
            <EnterPrivateRoomQuiz
                roomName={room.roomName}
                roomIconUrl={room.roomIconUrl}
                bannerUrl={room.roomBannerUrl}
                roomQuiz={room.roomQuiz}
                roomQuizScore={room.roomQuizScore}
                onEnter={() => {}}
            />
        );
    }

    return null;
}