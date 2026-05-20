import type { Entity } from "@/app/types/entity";

const KEY = "entities";

const getAll = (): Entity[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

const saveAll = (data: Entity[]) => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

export const getEntities = (): Entity[] => getAll();

export const upsertEntity = (entity: Entity) => {
    const current = getAll();
    const exists = current.findIndex(e => e.entityId === entity.entityId);
    const updated =
        exists >= 0
            ? current.map((e, i) => (i === exists ? entity : e))
            : [...current, entity];
    saveAll(updated);
};

export const deleteEntity = (entityId: string) => {
    saveAll(getAll().filter(e => e.entityId !== entityId));
};
