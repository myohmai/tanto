import { Fond } from "@/app/types/fond";

const FOND_KEY = "fonds";

const getFonds = (): Fond[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem(FOND_KEY);
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const saveFonds = (fonds: Fond[]) => {
    localStorage.setItem(FOND_KEY, JSON.stringify(fonds));
};

export const toggleFond = (glossId: string, userId: string) => {
    const fonds = getFonds();

    const exists = fonds.find(
        f => f.glossId === glossId && f.userId === userId
    );

    const updated = exists
        ? fonds.filter(
            f => !(f.glossId === glossId && f.userId === userId)
            )
            : [
                ...fonds,
                {
                    glossId,
                    userId,
                    createdAt: new Date().toISOString(),
                },
            ];

    saveFonds(updated);
};

export const getAllFonds = async (): Promise<Fond[]> => {
    return getFonds();
};

export const getFondsByUser = async (userId: string): Promise<Fond[]> => {
    return getFonds().filter(f => f.userId === userId);
};

export const getFondsByGloss = async (glossId: string): Promise<Fond[]> => {
    return getFonds().filter(f => f.glossId === glossId);
};

export const isFonded = (glossId: string, userId: string): boolean => {
    return getFonds().some(
        f => f.glossId === glossId && f.userId === userId
    );
};