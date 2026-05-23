import { supabase } from '@/lib/supabase';
import type { GlossData } from '@/app/types';
import type { Report } from '@/app/types/report';

type GlossRow = {
    gloss_id: string;
    room_id: string;
    salon_id: string | null;
    user_id: string | null;
    content: string;
    media: GlossData['media'] | null;
    media_embed: GlossData['mediaEmbed'] | null;
    revaluation: GlossData['revaluation'] | null;
    topic_id: string | null;
    posted_at: string;
    reply_to_gloss_id: string | null;
    room_name: string | null;
    salon_name: string | null;
    user_name: string | null;
    fond_count: number;
    reply_count: number;
    reports: Report[] | null;
};

const toGlossData = (row: GlossRow): GlossData => ({
    glossId:         row.gloss_id,
    roomId:          row.room_id,
    salonId:         row.salon_id ?? undefined,
    userId:          row.user_id ?? undefined,
    content:         row.content,
    media:           row.media ?? undefined,
    mediaEmbed:      row.media_embed ?? undefined,
    revaluation:     row.revaluation ?? undefined,
    postedAt:        row.posted_at,
    replyToGlossId:  row.reply_to_gloss_id ?? undefined,
    roomName:        row.room_name ?? '',
    salonName:       row.salon_name ?? undefined,
    userName:        row.user_name,
    fondCount:       row.fond_count,
    replyCount:      row.reply_count,
    reports:         row.reports ?? [],
});

export const getGlosses = async (): Promise<GlossData[]> => {
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as GlossRow[]).map(toGlossData);
};

export const getGlossesBySalon = async (salonId: string): Promise<GlossData[]> => {
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .eq('salon_id', salonId)
        .is('reply_to_gloss_id', null)
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as GlossRow[]).map(toGlossData);
};

export const getRepliesByGloss = async (glossId: string): Promise<GlossData[]> => {
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .eq('reply_to_gloss_id', glossId)
        .order('posted_at', { ascending: true });

    if (error) throw error;
    return (data as GlossRow[]).map(toGlossData);
};

export const getGlossById = async (glossId: string): Promise<GlossData | null> => {
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .eq('gloss_id', glossId)
        .single();

    if (error) return null;
    return toGlossData(data as GlossRow);
};

export const postGloss = async (gloss: Omit<GlossData, 'fondCount' | 'replyCount'>) => {
    const { error } = await supabase.from('glosses').insert({
        room_id:            gloss.roomId,
        salon_id:           gloss.salonId ?? null,
        user_id:            gloss.userId ?? null,
        content:            gloss.content,
        media:              gloss.media ?? null,
        media_embed:        gloss.mediaEmbed ?? null,
        revaluation:        gloss.revaluation ?? null,
        posted_at:          gloss.postedAt,
        reply_to_gloss_id:  gloss.replyToGlossId ?? null,
        user_name:          gloss.userName ?? null,
    });

    if (error) throw error;
};

export const getGlossesByIds = async (glossIds: string[]): Promise<GlossData[]> => {
    if (glossIds.length === 0) return [];
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .in('gloss_id', glossIds)
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as GlossRow[]).map(toGlossData);
};

export const deleteGloss = async (glossId: string) => {
    const { error } = await supabase
        .from('glosses')
        .delete()
        .eq('gloss_id', glossId);

    if (error) throw error;
};

export const addGlossReport = async (glossId: string, report: Report): Promise<void> => {
    const { error } = await supabase
        .from('gloss_reports')
        .insert({
            gloss_id: glossId,
            reporter_id: report.reporterId,
            type: report.type,
            created_at: new Date(report.createdAt).toISOString(),
        });

    if (error) throw error;
};

export const getReportedGlosses = async (): Promise<GlossData[]> => {
    const { data, error } = await supabase
        .from('gloss_feed')
        .select('*')
        .not('reports', 'eq', '[]')
        .order('posted_at', { ascending: false });

    if (error) throw error;
    return (data as GlossRow[])
        .map(toGlossData)
        .filter(g => (g.reports?.length ?? 0) > 0);
};
