// src/repositories/userRoom.ts

import type { UserRoomData } from "@/app/types/userRoomData";

const KEY = "user-rooms";

/* -----------------------------
    base storage
------------------------------ */

const getUserRooms = (): UserRoomData[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem(KEY);
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const saveUserRooms = (data: UserRoomData[]) => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

/* -----------------------------
    read API
------------------------------ */

export const getUserRoomData = async (
    userId: string,
    roomId: string
): Promise<UserRoomData[]> => {
    const data = getUserRooms();

    return data.filter(
        (u) => u.userId === userId && u.roomId === roomId
    );
};

export const getUserRoomByRoomId = async (
    roomId: string,
    userId: string
): Promise<UserRoomData | undefined> => {
    return getUserRooms().find(
        (r) => r.roomId === roomId && r.userId === userId
    );
};

export const getUserRoomsByUser = async (
    userId: string
): Promise<UserRoomData[]> => {
    return getUserRooms().filter(
        (u) => u.userId === userId
    );
};

export const getUsersByRoomId = async (
    roomId: string
): Promise<UserRoomData[]> => {
    return getUserRooms().filter(
        (u) => u.roomId === roomId
    );
};

export const getUserRoomsByRoomId = async (roomId: string) => {
    return getUserRooms().filter(u => u.roomId === roomId);
};
/* -----------------------------
    join / leave
------------------------------ */

export const toggleJoinRoom = (room: UserRoomData) => {
    const current = getUserRooms();

    const exists = current.find(
        (r) =>
            r.roomId === room.roomId &&
            r.userId === room.userId
    );

    const updated = exists
        ? current.filter(
                (r) =>
                    !(
                        r.roomId === room.roomId &&
                        r.userId === room.userId
                    )
            )
        : [...current, room];

    saveUserRooms(updated);
};

export const leaveRoom = (roomId: string, userId: string) => {
    const current = getUserRooms();

    const updated = current.filter(
        (r) => !(r.roomId === roomId && r.userId === userId)
    );

    saveUserRooms(updated);
};

/* -----------------------------
    helpers
------------------------------ */

export const isJoined = (
    roomId: string,
    userId: string
): boolean => {
    return getUserRooms().some(
        (r) => r.roomId === roomId && r.userId === userId
    );
};

/* -----------------------------
    update
------------------------------ */
export const updateUserRoom = async (payload: {
    userId: string;
    roomId: string;
    userName: string;
    iconUrl?: string;
    subIcon?: any;
}) => {
    if (typeof window === "undefined") return;

    const current = getUserRooms();

    const updated = current.map((r) => {
        if (r.userId === payload.userId && r.roomId === payload.roomId) {
            return {
                ...r,
                userName: payload.userName,
                iconUrl: payload.iconUrl,
                subIcon: payload.subIcon,
            };
        }
        return r;
    });

    saveUserRooms(updated);
};