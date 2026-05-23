import { supabase } from '@/lib/supabase';
import type { SongRequest, SongRequestMetadata, SongRequestType, SongRequestWithVotes, Vote } from '@/app/types/songRequest';

type SongRequestRow = {
    id: string;
    room_id: string;
    requested_by: string;
    url: string;
    type: SongRequestType;
    metadata: SongRequestMetadata;
    status: SongRequest['status'];
    created_at: string;
    expires_at: string;
};

type VoteRow = {
    id: string;
    request_id: string;
    user_id: string;
    approved: boolean;
    voted_at: string;
};

const toSongRequest = (row: SongRequestRow): SongRequest => ({
    id:          row.id,
    roomId:      row.room_id,
    requestedBy: row.requested_by,
    url:         row.url,
    type:        row.type,
    metadata:    row.metadata,
    status:      row.status,
    createdAt:   row.created_at,
    expiresAt:   row.expires_at,
});

const toVote = (row: VoteRow): Vote => ({
    id:        row.id,
    requestId: row.request_id,
    userId:    row.user_id,
    approved:  row.approved,
    votedAt:   row.voted_at,
});

export const getPendingSongRequests = async (roomId: string): Promise<SongRequest[]> => {
    const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as SongRequestRow[]).map(toSongRequest);
};

export const getPendingCount = async (roomId: string): Promise<number> => {
    const { count, error } = await supabase
        .from('song_requests')
        .select('id', { count: 'exact', head: true })
        .eq('room_id', roomId)
        .eq('status', 'pending');

    if (error) throw error;
    return count ?? 0;
};

export const getSongRequestWithVotes = async (requestId: string): Promise<SongRequestWithVotes | null> => {
    const [{ data: reqData, error: reqError }, { data: voteData, error: voteError }, { data: amData }] =
        await Promise.all([
            supabase.from('song_requests').select('*').eq('id', requestId).single(),
            supabase.from('votes').select('*').eq('request_id', requestId),
            supabase.from('active_members').select('active_count').eq('room_id',
                (await supabase.from('song_requests').select('room_id').eq('id', requestId).single()).data?.room_id
            ).single(),
        ]);

    if (reqError || !reqData) return null;
    if (voteError) throw voteError;

    return {
        ...toSongRequest(reqData as SongRequestRow),
        votes: (voteData as VoteRow[]).map(toVote),
        activeMembers: (amData as { active_count: number } | null)?.active_count ?? 0,
    };
};

export const createSongRequest = async (
    roomId: string,
    requestedBy: string,
    url: string,
    type: SongRequestType,
    metadata: SongRequestMetadata,
): Promise<SongRequest> => {
    const { data, error } = await supabase
        .from('song_requests')
        .insert({ room_id: roomId, requested_by: requestedBy, url, type, metadata })
        .select()
        .single();

    if (error) throw error;
    return toSongRequest(data as SongRequestRow);
};

export const submitVote = async (requestId: string, userId: string, approved: boolean): Promise<void> => {
    const { error } = await supabase
        .from('votes')
        .upsert({ request_id: requestId, user_id: userId, approved }, { onConflict: 'request_id,user_id' });

    if (error) throw error;
};

export const getMyFailedSongRequests = async (roomId: string, userId: string): Promise<SongRequest[]> => {
    const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .eq('room_id', roomId)
        .eq('requested_by', userId)
        .in('status', ['rejected', 'timeout'])
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as SongRequestRow[]).map(toSongRequest);
};

export const deleteSongRequest = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('song_requests')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
