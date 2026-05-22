import { supabase } from '@/lib/supabase';

export type Block = {
    userId:              string;
    targetUserId:        string;
    roomId?:             string | null;
    isAnonymous:         boolean;
    targetSnapshotName?: string | null;
    targetSnapshotIcon?: string | null;
};

export type BlockWithRoom = Block & {
    roomName: string | null;
};

type BlockRow = {
    user_id:               string;
    target_user_id:        string;
    room_id:               string | null;
    is_anonymous:          boolean;
    target_snapshot_name:  string | null;
    target_snapshot_icon:  string | null;
    rooms:                 { room_name: string }[] | null;
};

const toBlock = (r: Omit<BlockRow, 'rooms'>): Block => ({
    userId:              r.user_id,
    targetUserId:        r.target_user_id,
    roomId:              r.room_id ?? null,
    isAnonymous:         r.is_anonymous,
    targetSnapshotName:  r.target_snapshot_name ?? null,
    targetSnapshotIcon:  r.target_snapshot_icon ?? null,
});

export const getBlocksByUser = async (userId: string): Promise<Block[]> => {
    const { data, error } = await supabase
        .from('blocks')
        .select('user_id, target_user_id, room_id, is_anonymous, target_snapshot_name, target_snapshot_icon')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as Omit<BlockRow, 'rooms'>[]).map(toBlock);
};

export const getBlocksWithRoom = async (userId: string): Promise<BlockWithRoom[]> => {
    const { data, error } = await supabase
        .from('blocks')
        .select('user_id, target_user_id, room_id, is_anonymous, target_snapshot_name, target_snapshot_icon, rooms(room_name)')
        .eq('user_id', userId);
    if (error) throw error;
    return (data as BlockRow[]).map(r => ({
        ...toBlock(r),
        roomName: r.rooms?.[0]?.room_name ?? null,
    }));
};

export const toggleBlock = async (params: {
    userId:              string;
    targetUserId:        string;
    roomId?:             string | null;
    isAnonymous?:        boolean;
    targetSnapshotName?: string | null;
    targetSnapshotIcon?: string | null;
}) => {
    const {
        userId,
        targetUserId,
        roomId             = null,
        isAnonymous        = false,
        targetSnapshotName = null,
        targetSnapshotIcon = null,
    } = params;

    const { data } = await supabase
        .from('blocks')
        .select('user_id')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .maybeSingle();

    if (data) {
        const { error } = await supabase
            .from('blocks')
            .delete()
            .eq('user_id', userId)
            .eq('target_user_id', targetUserId);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('blocks')
            .insert({
                user_id:              userId,
                target_user_id:       targetUserId,
                room_id:              roomId,
                is_anonymous:         isAnonymous,
                target_snapshot_name: targetSnapshotName,
                target_snapshot_icon: targetSnapshotIcon,
            });
        if (error) throw error;
    }
};
