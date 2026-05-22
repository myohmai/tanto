import { supabase } from '@/lib/supabase';
import type { UserRoomData } from '@/app/types/userRoomData';

type UserRoomRow = {
    user_id: string;
    room_id: string;
    room_name: string | null;
    icon_url: string | null;
    sub_icon: UserRoomData['subIcon'] | null;
    user_name: string | null;
};

const toUserRoomData = (row: UserRoomRow): UserRoomData => ({
    userId:   row.user_id,
    roomId:   row.room_id,
    roomName: row.room_name,
    iconUrl:  row.icon_url,
    subIcon:  row.sub_icon ?? undefined,
    userName: row.user_name,
});

export const getUserRoomData = async (userId: string, roomId: string): Promise<UserRoomData[]> => {
    const { data, error } = await supabase
        .from('user_rooms')
        .select('*')
        .eq('user_id', userId)
        .eq('room_id', roomId);
    if (error) throw error;
    return (data as UserRoomRow[]).map(toUserRoomData);
};

export const getUserRoomByRoomId = async (roomId: string, userId: string): Promise<UserRoomData | undefined> => {
    const { data } = await supabase
        .from('user_rooms')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .maybeSingle();
    return data ? toUserRoomData(data as UserRoomRow) : undefined;
};

export const getUserRoomsByUser = async (userId: string): Promise<UserRoomData[]> => {
    const { data, error } = await supabase
        .from('user_rooms')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as UserRoomRow[]).map(toUserRoomData);
};

export const getUsersByRoomId = async (roomId: string): Promise<UserRoomData[]> => {
    const { data, error } = await supabase
        .from('user_rooms')
        .select('*')
        .eq('room_id', roomId);
    if (error) throw error;
    return (data as UserRoomRow[]).map(toUserRoomData);
};

export const getUserRoomsByRoomId = async (roomId: string): Promise<UserRoomData[]> => {
    return getUsersByRoomId(roomId);
};

export const isJoined = async (roomId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('user_rooms')
        .select('user_id')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .maybeSingle();
    return data !== null;
};

export const toggleJoinRoom = async (room: UserRoomData) => {
    const joined = await isJoined(room.roomId, room.userId);

    if (joined) {
        const { error } = await supabase
            .from('user_rooms')
            .delete()
            .eq('room_id', room.roomId)
            .eq('user_id', room.userId);
        if (error) throw error;
    } else {
        const { error } = await supabase.from('user_rooms').insert({
            user_id:   room.userId,
            room_id:   room.roomId,
            room_name: room.roomName ?? null,
            icon_url:  room.iconUrl ?? null,
            sub_icon:  room.subIcon ?? null,
            user_name: room.userName ?? null,
        });
        if (error) throw error;
    }
};

export const leaveRoom = async (roomId: string, userId: string) => {
    const { error } = await supabase
        .from('user_rooms')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);
    if (error) throw error;
};

export const updateUserRoom = async (payload: {
    userId: string;
    roomId: string;
    userName: string;
    iconUrl?: string;
    subIcon?: UserRoomData['subIcon'];
}) => {
    const { error } = await supabase
        .from('user_rooms')
        .update({
            user_name: payload.userName,
            icon_url:  payload.iconUrl ?? null,
            sub_icon:  payload.subIcon ?? null,
        })
        .eq('user_id', payload.userId)
        .eq('room_id', payload.roomId);
    if (error) throw error;
};
