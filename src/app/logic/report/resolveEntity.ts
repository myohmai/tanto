import type { Entity, UserRoomEntity } from "@/app/types/entity";

export const resolveEntityId = (entityId: string, entities: Entity[]): string => {
    const entity = entities.find(e => e.entityId === entityId);
    return entity?.canonicalEntityId ?? entityId;
};

export const getAncestors = (entityId: string, entities: Entity[]): string[] => {
    const ancestors: string[] = [];
    const canonical = resolveEntityId(entityId, entities);
    let current = entities.find(e => e.entityId === canonical);
    while (current?.parentEntityId) {
        const parentId = resolveEntityId(current.parentEntityId, entities);
        ancestors.push(parentId);
        current = entities.find(e => e.entityId === parentId);
    }
    return ancestors;
};

export const getRelatedEntityIds = (entityId: string, entities: Entity[]): string[] => {
    const canonical = resolveEntityId(entityId, entities);
    return [canonical, ...getAncestors(canonical, entities)];
};

export const getUserInterests = (userId: string, userRoomEntities: UserRoomEntity[]): string[] => {
    return [...new Set(
        userRoomEntities
            .filter(ure => ure.userId === userId)
            .map(ure => ure.entityId)
    )];
};
