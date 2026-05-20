import { getCurrentUserId } from "@/repositories/currentUser";
import { isJoined } from "@/repositories/userRoom";
import type { RoomData } from "@/app/types/room";

export const canAccessRoom = async (roomId: string, roomData?: RoomData) => {
    const userId = await getCurrentUserId();

    const joined = isJoined(roomId, userId);

    const isHost = roomData?.roomHost?.userId === userId;

    return joined || isHost;
};