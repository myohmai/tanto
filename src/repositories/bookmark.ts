import { supabase } from '@/lib/supabase';

export type TopicBookmark = {
    topicId: string;
    userId: string;
    createdAt: string;
};

type BookmarkRow = {
    topic_id: string;
    user_id: string;
    created_at: string;
};

const toBookmark = (row: BookmarkRow): TopicBookmark => ({
    topicId:   row.topic_id,
    userId:    row.user_id,
    createdAt: row.created_at,
});

export const getBookmarksByUser = async (userId: string): Promise<TopicBookmark[]> => {
    const { data, error } = await supabase
        .from('topic_bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as BookmarkRow[]).map(toBookmark);
};

export const isBookmarked = async (topicId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('topic_bookmarks')
        .select('topic_id')
        .eq('topic_id', topicId)
        .eq('user_id', userId)
        .maybeSingle();
    return data !== null;
};

export const toggleBookmark = async (topicId: string, userId: string): Promise<void> => {
    const already = await isBookmarked(topicId, userId);
    if (already) {
        const { error } = await supabase
            .from('topic_bookmarks')
            .delete()
            .eq('topic_id', topicId)
            .eq('user_id', userId);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('topic_bookmarks')
            .insert({ topic_id: topicId, user_id: userId });
        if (error) throw error;
    }
};
