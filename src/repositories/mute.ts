import { supabase } from '@/lib/supabase';
import type { SalonIcon } from '@/app/types/salon';

export type Mute = {
    userId: string;
    roomId?: string;
    salonId?: string;
};

export type MutedRoom = {
    id:          string;
    roomId:      string;
    roomName:    string | null;
    roomIconUrl: string | null;
};

export type MutedSalon = {
    id:        string;
    salonId:   string;
    salonName: string;
    salonIcon: SalonIcon;
    roomName:  string | null;
};

// ─── 既存 ───────────────────────────────────────────────

export const getMutesByUser = async (userId: string): Promise<Mute[]> => {
    const { data, error } = await supabase
        .from('mutes')
        .select('user_id, room_id, salon_id')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as { user_id: string; room_id: string | null; salon_id: string | null }[]).map(r => ({
        userId:  r.user_id,
        roomId:  r.room_id ?? undefined,
        salonId: r.salon_id ?? undefined,
    }));
};

export const toggleMute = async (mute: Mute) => {
    const query = supabase
        .from('mutes')
        .select('id')
        .eq('user_id', mute.userId);

    if (mute.roomId)  query.eq('room_id', mute.roomId);
    if (mute.salonId) query.eq('salon_id', mute.salonId);

    const { data } = await query.maybeSingle();

    if (data) {
        const { error } = await supabase
            .from('mutes')
            .delete()
            .eq('id', (data as { id: string }).id);
        if (error) throw error;
    } else {
        const { error } = await supabase.from('mutes').insert({
            user_id:  mute.userId,
            room_id:  mute.roomId ?? null,
            salon_id: mute.salonId ?? null,
        });
        if (error) throw error;
    }
};

// ─── ミュートリスト用 ────────────────────────────────────

export const getMutedRooms = async (userId: string): Promise<MutedRoom[]> => {
    const { data, error } = await supabase
        .from('mutes')
        .select('id, room_id, rooms(room_name, room_icon_url)')
        .eq('user_id', userId)
        .not('room_id', 'is', null);
    if (error) throw error;

    return (data as {
        id:      string;
        room_id: string;
        rooms:   { room_name: string; room_icon_url: string | null }[] | null;
    }[]).map(r => ({
        id:          r.id,
        roomId:      r.room_id,
        roomName:    r.rooms?.[0]?.room_name ?? null,
        roomIconUrl: r.rooms?.[0]?.room_icon_url ?? null,
    }));
};

export const getMutedSalons = async (userId: string): Promise<MutedSalon[]> => {
    const { data, error } = await supabase
        .from('mutes')
        .select('id, salon_id, salons(salon_name, salon_icon, rooms(room_name))')
        .eq('user_id', userId)
        .not('salon_id', 'is', null);
    if (error) throw error;

    return (data as {
        id:       string;
        salon_id: string;
        salons:   {
            salon_name: string;
            salon_icon: SalonIcon;
            rooms:      { room_name: string }[] | null;
        }[] | null;
    }[]).map(r => ({
        id:        r.id,
        salonId:   r.salon_id,
        salonName: r.salons?.[0]?.salon_name ?? '',
        salonIcon: r.salons?.[0]?.salon_icon ?? { type: 'emoji', value: '💬' },
        roomName:  r.salons?.[0]?.rooms?.[0]?.room_name ?? null,
    }));
};

export const deleteMuteById = async (id: string) => {
    const { error } = await supabase
        .from('mutes')
        .delete()
        .eq('id', id);
    if (error) throw error;
};
