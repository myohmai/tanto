import { supabase } from '@/lib/supabase';
import type { UserRoomEntity } from '@/app/types/entity';

type UserRoomEntityRow = {
    user_id: string;
    room_id: string;
    entity_id: string;
};

const toUserRoomEntity = (row: UserRoomEntityRow): UserRoomEntity => ({
    userId:   row.user_id,
    roomId:   row.room_id,
    entityId: row.entity_id,
});

export const getUserRoomEntitiesByUser = async (userId: string): Promise<UserRoomEntity[]> => {
    const { data, error } = await supabase
        .from('user_room_entities')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as UserRoomEntityRow[]).map(toUserRoomEntity);
};

export const getUserRoomEntitiesByRoom = async (roomId: string): Promise<UserRoomEntity[]> => {
    const { data, error } = await supabase
        .from('user_room_entities')
        .select('*')
        .eq('room_id', roomId);
    if (error) throw error;
    return (data as UserRoomEntityRow[]).map(toUserRoomEntity);
};

export const addUserRoomEntities = async (
    userId: string,
    roomId: string,
    entityIds: string[]
) => {
    if (entityIds.length === 0) return;

    const rows = entityIds.map(entityId => ({ user_id: userId, room_id: roomId, entity_id: entityId }));
    const { error } = await supabase
        .from('user_room_entities')
        .upsert(rows, { onConflict: 'user_id,room_id,entity_id' });
    if (error) throw error;
};

export const removeUserRoomEntities = async (userId: string, roomId: string) => {
    const { error } = await supabase
        .from('user_room_entities')
        .delete()
        .eq('user_id', userId)
        .eq('room_id', roomId);
    if (error) throw error;
};
