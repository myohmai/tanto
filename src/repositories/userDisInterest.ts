import type { UserDisInterest } from "@/app/types/entity";

const KEY = "user-dis-interests";

const getAll = (): UserDisInterest[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const saveAll = (data: UserDisInterest[]) => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

export const addUserDisInterest = (userId: string, entityId: string) => {
    const current = getAll();
    const exists = current.some(d => d.userId === userId && d.entityId === entityId);
    if (!exists) {
        saveAll([...current, { userId, entityId, createdAt: new Date().toISOString() }]);
    }
};

export const removeUserDisInterest = (userId: string, entityId: string) => {
    saveAll(getAll().filter(d => !(d.userId === userId && d.entityId === entityId)));
};

export const getUserDisInterestsByUser = (userId: string): UserDisInterest[] => {
    return getAll().filter(d => d.userId === userId);
};
