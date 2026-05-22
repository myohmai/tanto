import { supabase } from '@/lib/supabase';
import type { UserDisInterest } from '@/app/types/entity';

type UserDisInterestRow = {
    user_id: string;
    entity_id: string;
    created_at: string;
};

const toUserDisInterest = (row: UserDisInterestRow): UserDisInterest => ({
    userId:    row.user_id,
    entityId:  row.entity_id,
    createdAt: row.created_at,
});

export const getUserDisInterestsByUser = async (userId: string): Promise<UserDisInterest[]> => {
    const { data, error } = await supabase
        .from('user_dis_interests')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as UserDisInterestRow[]).map(toUserDisInterest);
};

export const addUserDisInterest = async (userId: string, entityId: string) => {
    const { error } = await supabase
        .from('user_dis_interests')
        .upsert({ user_id: userId, entity_id: entityId }, { onConflict: 'user_id,entity_id' });
    if (error) throw error;
};

export const removeUserDisInterest = async (userId: string, entityId: string) => {
    const { error } = await supabase
        .from('user_dis_interests')
        .delete()
        .eq('user_id', userId)
        .eq('entity_id', entityId);
    if (error) throw error;
};
