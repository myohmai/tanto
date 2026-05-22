import { supabase } from '@/lib/supabase';
import type { SalonData } from '@/app/types';

type SalonRow = {
    salon_id: string;
    room_id: string;
    salon_name: string;
    salon_icon: SalonData['salonIcon'];
    is_topic_box: boolean;
    is_pinned: boolean;
};

const toSalonData = (row: SalonRow): SalonData => ({
    salonId:    row.salon_id,
    roomId:     row.room_id,
    salonName:  row.salon_name,
    salonIcon:  row.salon_icon,
    isTopicBox: row.is_topic_box,
    isPinned:   row.is_pinned,
});

export const getSalons = async (): Promise<SalonData[]> => {
    const { data, error } = await supabase
        .from('salons')
        .select('*');

    if (error) throw error;
    return (data as SalonRow[]).map(toSalonData);
};

export const getSalonsByRoom = async (roomId: string): Promise<SalonData[]> => {
    const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('room_id', roomId)
        .order('is_pinned', { ascending: false });

    if (error) throw error;
    return (data as SalonRow[]).map(toSalonData);
};

export const createSalon = async (salon: SalonData) => {
    const { error } = await supabase.from('salons').insert({
        room_id:     salon.roomId,
        salon_name:  salon.salonName,
        salon_icon:  salon.salonIcon,
        is_topic_box: salon.isTopicBox,
        is_pinned:   salon.isPinned,
    });

    if (error) throw error;
};

export const updateSalon = async (salon: SalonData) => {
    const { error } = await supabase
        .from('salons')
        .update({
            salon_name:  salon.salonName,
            salon_icon:  salon.salonIcon,
            is_topic_box: salon.isTopicBox,
            is_pinned:   salon.isPinned,
        })
        .eq('salon_id', salon.salonId!);

    if (error) throw error;
};

export const deleteSalon = async (salonId: string) => {
    const { error } = await supabase
        .from('salons')
        .delete()
        .eq('salon_id', salonId);

    if (error) throw error;
};
