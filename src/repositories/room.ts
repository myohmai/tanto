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

export const saveRoom = (room: RoomData) => {
    const saved = localStorage.getItem("created-rooms");
    const rooms = saved ? JSON.parse(saved) : [];

    const updated = rooms.some((r: RoomData) => r.roomId === room.roomId)
        ? rooms.map((r: RoomData) => r.roomId === room.roomId ? room : r)
        : [...rooms, room];

    localStorage.setItem("created-rooms", JSON.stringify(updated));
};

export const deleteRoom = (roomId: string) => {
    const saved = localStorage.getItem("created-rooms");
    if (!saved) return;

    const rooms = JSON.parse(saved);
    const updated = rooms.filter((r: RoomData) => r.roomId !== roomId);

    localStorage.setItem("created-rooms", JSON.stringify(updated));
};