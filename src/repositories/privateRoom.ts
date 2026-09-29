import { supabase } from '@/lib/supabase';
import type { UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon';

// Private Room の入室まわり。合言葉・クイズの正解は DB から出さず、判定は DB 関数で行う。
// (supabase/migrations/20260929000004_private_room_entry.sql)

export type PrivateRoomQuizQuestion = {
    id: string;
    question: string;
    option: { id: string; text: string }[];
};

export type PrivateRoomGate = {
    roomId: string;
    roomName: string;
    roomIconUrl: string | null;
    roomBannerUrl: string | null;
    roomRule: string;
    roomMemberIni: { iconUrl?: string | null; initialName?: string | null } | null;
    entrySetting: 'keyword' | 'quiz' | null;
    keywordHint: string | null;
    quiz: PrivateRoomQuizQuestion[];
    isMember: boolean;
};

// 合言葉なら keyword、クイズなら選んだ選択肢の id の配列
export type PrivateRoomCredentials = {
    keyword?: string;
    answers?: string[];
};

// Private Room でなければ null
export const getPrivateRoomGate = async (roomId: string): Promise<PrivateRoomGate | null> => {
    const { data, error } = await supabase.rpc('get_private_room_gate', { p_room_id: roomId });
    if (error) throw error;
    return (data as PrivateRoomGate | null) ?? null;
};

export const verifyPrivateRoomEntry = async (
    roomId: string,
    credentials: PrivateRoomCredentials,
): Promise<boolean> => {
    const { data, error } = await supabase.rpc('verify_private_room_entry', {
        p_room_id: roomId,
        p_keyword: credentials.keyword ?? null,
        p_answers: credentials.answers ?? null,
    });
    if (error) throw error;
    return data === true;
};

// 判定に通れば参加登録(user_rooms / user_room_entities)まで行う
export const enterPrivateRoom = async (
    roomId: string,
    credentials: PrivateRoomCredentials,
    profile: { userName?: string | null; iconUrl?: string | null; subIcon?: UserSubIcon | null },
): Promise<boolean> => {
    const { data, error } = await supabase.rpc('enter_private_room', {
        p_room_id: roomId,
        p_keyword: credentials.keyword ?? null,
        p_answers: credentials.answers ?? null,
        p_user_name: profile.userName ?? null,
        p_icon_url: profile.iconUrl ?? null,
        p_sub_icon: profile.subIcon ?? null,
    });
    if (error) throw error;
    return data === true;
};
