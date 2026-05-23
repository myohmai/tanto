import { supabase } from '@/lib/supabase';
import type { TurnTableData } from '@/app/types/turntable';

type TurntableRow = {
    id: string;
    room_id: string;
    type: 'video' | 'music';
    video: TurnTableData['video'] | null;
    music: TurnTableData['music'] | null;
};

const toTurnTableData = (row: TurntableRow): TurnTableData => ({
    id:     row.id,
    roomId: row.room_id,
    type:   row.type,
    video:  row.video ?? undefined,
    music:  row.music ?? undefined,
});

export const getTurntables = async (): Promise<TurnTableData[]> => {
    const { data, error } = await supabase
        .from('turntables')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as TurntableRow[]).map(toTurnTableData);
};

export const getTurntablesByRoom = async (roomId: string): Promise<TurnTableData[]> => {
    const { data, error } = await supabase
        .from('turntables')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as TurntableRow[]).map(toTurnTableData);
};

export const addTurntable = async (turntable: TurnTableData) => {
    const { error } = await supabase.from('turntables').insert({
        room_id: turntable.roomId,
        type:    turntable.type,
        video:   turntable.video ?? null,
        music:   turntable.music ?? null,
    });

    if (error) throw error;
};

export const deleteTurntable = async (id: string) => {
    const { error } = await supabase
        .from('turntables')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const getTurntableById = async (id: string): Promise<TurnTableData | null> => {
    const { data, error } = await supabase
        .from('turntables')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return toTurnTableData(data as TurntableRow);
};

export const getRoomIdsByVideoId = async (videoId: string): Promise<string[]> => {
    const { data, error } = await supabase
        .from('turntables')
        .select('room_id')
        .filter('video->>videoId', 'eq', videoId);

    if (error) throw error;
    return [...new Set((data as { room_id: string }[]).map(r => r.room_id))];
};

export const getRoomIdsByMusicUrl = async (url: string): Promise<string[]> => {
    const { data, error } = await supabase
        .from('turntables')
        .select('room_id')
        .filter('music->>url', 'eq', url);

    if (error) throw error;
    return [...new Set((data as { room_id: string }[]).map(r => r.room_id))];
};
