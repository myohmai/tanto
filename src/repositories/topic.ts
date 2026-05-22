import { supabase } from '@/lib/supabase';
import type { Topic } from '@/app/types';

type TopicRow = {
    topic_id: string;
    room_id: string;
    salon_id: string;
    user_id: string;
    topic_content: string;
    media: Topic['media'] | null;
    media_embed: Topic['mediaEmbed'] | null;
    posted_at: string;
};

const toTopic = (row: TopicRow): Topic => ({
    topicId:    row.topic_id,
    roomId:     row.room_id,
    salonId:    row.salon_id,
    userId:     row.user_id,
    topicContent: row.topic_content,
    media:      row.media ?? undefined,
    mediaEmbed: row.media_embed ?? undefined,
    postedAt:   row.posted_at,
});

export const getTopics = async (): Promise<Topic[]> => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as TopicRow[]).map(toTopic);
};

export const getTopicsBySalon = async (salonId: string): Promise<Topic[]> => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('salon_id', salonId)
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as TopicRow[]).map(toTopic);
};

export const getTopicsByIds = async (topicIds: string[]): Promise<Topic[]> => {
    if (topicIds.length === 0) return [];
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .in('topic_id', topicIds)
        .order('posted_at', { ascending: false });
    if (error) throw error;
    return (data as TopicRow[]).map(toTopic);
};

export const postTopic = async (topic: Topic) => {
    const { error } = await supabase.from('topics').insert({
        room_id:        topic.roomId,
        salon_id:       topic.salonId,
        user_id:        topic.userId,
        topic_content:  topic.topicContent,
        media:          topic.media ?? null,
        media_embed:    topic.mediaEmbed ?? null,
        posted_at:      topic.postedAt,
    });

    if (error) throw error;
};
