import type { UserRoomEntity } from "@/app/types/entity";

const KEY = "user-room-entities";

const getAll = (): UserRoomEntity[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const saveAll = (data: UserRoomEntity[]) => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

export const addUserRoomEntities = (
    userId: string,
    roomId: string,
    entityIds: string[]
) => {
    const current = getAll();
    const newEntries = entityIds
        .filter(entityId =>
            !current.some(
                e => e.userId === userId && e.roomId === roomId && e.entityId === entityId
            )
        )
        .map(entityId => ({ userId, roomId, entityId }));

    if (newEntries.length > 0) {
        saveAll([...current, ...newEntries]);
    }
};

export const removeUserRoomEntities = (userId: string, roomId: string) => {
    const current = getAll();
    saveAll(current.filter(e => !(e.userId === userId && e.roomId === roomId)));
};

export const getUserRoomEntitiesByUser = (userId: string): UserRoomEntity[] => {
    return getAll().filter(e => e.userId === userId);
};

export const getUserRoomEntitiesByRoom = (roomId: string): UserRoomEntity[] => {
    return getAll().filter(e => e.roomId === roomId);
};
