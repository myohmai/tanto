import type { RoomData } from "@/app/types/room";
import { mockRooms } from "@/mocks/room";

const getCreatedRooms = (): RoomData[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("created-rooms");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

export const getRooms = async () => {
    const createdRooms = getCreatedRooms();

    return [...createdRooms, ...mockRooms];
};