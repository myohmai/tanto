import { supabase } from '@/lib/supabase';
import type { Fond } from '@/app/types/fond';

type FondRow = {
    gloss_id: string;
    user_id: string;
    created_at: string;
};

const toFond = (row: FondRow): Fond => ({
    glossId:   row.gloss_id,
    userId:    row.user_id,
    createdAt: row.created_at,
});

export const getAllFonds = async (): Promise<Fond[]> => {
    const { data, error } = await supabase.from('fonds').select('*');
    if (error) throw error;
    return (data as FondRow[]).map(toFond);
};

export const getFondsByUser = async (userId: string): Promise<Fond[]> => {
    const { data, error } = await supabase
        .from('fonds')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as FondRow[]).map(toFond);
};

export const getFondsByGloss = async (glossId: string): Promise<Fond[]> => {
    const { data, error } = await supabase
        .from('fonds')
        .select('*')
        .eq('gloss_id', glossId);
    if (error) throw error;
    return (data as FondRow[]).map(toFond);
};

export const isFonded = async (glossId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('fonds')
        .select('gloss_id')
        .eq('gloss_id', glossId)
        .eq('user_id', userId)
        .maybeSingle();
    return data !== null;
};

export const toggleFond = async (glossId: string, userId: string) => {
    const fonded = await isFonded(glossId, userId);

    if (fonded) {
        const { error } = await supabase
            .from('fonds')
            .delete()
            .eq('gloss_id', glossId)
            .eq('user_id', userId);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('fonds')
            .insert({ gloss_id: glossId, user_id: userId });
        if (error) throw error;
    }
};
