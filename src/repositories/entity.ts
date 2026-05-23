import { supabase } from '@/lib/supabase';
import type { Entity, ExternalService } from '@/app/types/entity';

type EntityRow = {
    entity_id: string;
    label: string;
    entity_type: 'external' | 'tag';
    canonical_entity_id: string | null;
    parent_entity_id: string | null;
    external_service: ExternalService | null;
    external_id: string | null;
    thumbnail_url: string | null;
};

const toEntity = (row: EntityRow): Entity => ({
    entityId:          row.entity_id,
    label:             row.label,
    entityType:        row.entity_type,
    canonicalEntityId: row.canonical_entity_id ?? undefined,
    parentEntityId:    row.parent_entity_id ?? undefined,
    externalService:   row.external_service ?? undefined,
    externalId:        row.external_id ?? undefined,
    thumbnailUrl:      row.thumbnail_url ?? undefined,
});

export const getEntities = async (): Promise<Entity[]> => {
    const { data, error } = await supabase.from('entities').select('*');
    if (error) throw error;
    return (data as EntityRow[]).map(toEntity);
};

export const getEntityById = async (entityId: string): Promise<Entity | null> => {
    const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('entity_id', entityId)
        .single();
    if (error) return null;
    return toEntity(data as EntityRow);
};

export const getEntityByExternalId = async (
    service: ExternalService,
    externalId: string
): Promise<Entity | null> => {
    const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('external_service', service)
        .eq('external_id', externalId)
        .single();
    if (error) return null;
    return toEntity(data as EntityRow);
};

export const upsertEntity = async (entity: Entity): Promise<string> => {
    const { data, error } = await supabase
        .from('entities')
        .upsert({
            entity_id:           entity.entityId,
            label:               entity.label,
            entity_type:         entity.entityType,
            canonical_entity_id: entity.canonicalEntityId ?? null,
            parent_entity_id:    entity.parentEntityId ?? null,
            external_service:    entity.externalService ?? null,
            external_id:         entity.externalId ?? null,
            thumbnail_url:       entity.thumbnailUrl ?? null,
        }, { onConflict: 'entity_id' })
        .select('entity_id')
        .single();
    if (error) throw error;
    return (data as { entity_id: string }).entity_id;
};

export const deleteEntity = async (entityId: string) => {
    const { error } = await supabase
        .from('entities')
        .delete()
        .eq('entity_id', entityId);
    if (error) throw error;
};
