import { RoomData } from "@/app/types/room";

const ROOM_SCORE_WEIGHT = {
    member: 1,
    gloss: 0.5,
    recent: 3,
} as const;

export const calcRoomActivityScore = (room: RoomData) => {
    return (
        room.roomMemberCount * ROOM_SCORE_WEIGHT.member +
        room.glossCount * ROOM_SCORE_WEIGHT.gloss +
        room.recentGlossCount * ROOM_SCORE_WEIGHT.recent
    );
};