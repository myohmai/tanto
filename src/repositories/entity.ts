import { supabase } from '@/lib/supabase';
import type { Entity } from '@/app/types/entity';

type EntityRow = {
    entity_id: string;
    label: string;
    entity_type: 'external' | 'tag';
    canonical_entity_id: string | null;
    parent_entity_id: string | null;
};

const toEntity = (row: EntityRow): Entity => ({
    entityId:          row.entity_id,
    label:             row.label,
    entityType:        row.entity_type,
    canonicalEntityId: row.canonical_entity_id ?? undefined,
    parentEntityId:    row.parent_entity_id ?? undefined,
});

export const getEntities = async (): Promise<Entity[]> => {
    const { data, error } = await supabase.from('entities').select('*');
    if (error) throw error;
    return (data as EntityRow[]).map(toEntity);
};

export const upsertEntity = async (entity: Entity) => {
    const { error } = await supabase.from('entities').upsert({
        entity_id:          entity.entityId,
        label:              entity.label,
        entity_type:        entity.entityType,
        canonical_entity_id: entity.canonicalEntityId ?? null,
        parent_entity_id:   entity.parentEntityId ?? null,
    }, { onConflict: 'entity_id' });
    if (error) throw error;
};

export const deleteEntity = async (entityId: string) => {
    const { error } = await supabase
        .from('entities')
        .delete()
        .eq('entity_id', entityId);
    if (error) throw error;
};
