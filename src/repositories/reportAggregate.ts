import { supabase } from '@/lib/supabase';
import type { ReportType } from '@/app/types/report';

// 通報判定用の集計(DB 関数 get_gloss_report_aggregates / get_room_report_aggregates)。
// 通報者の個人データは返さず、通報種別ごとの集計値だけを受け取る。
// (supabase/migrations/20260929000003_report_aggregates.sql)
export type ReportAggregate = {
    targetId: string;
    reportType: ReportType;
    reportCount: number;
    totalWeight: number;
    sameRoomWeight: number;
    topEntityReporters: number;
};

type ReportAggregateRow = {
    target_id: string;
    report_type: ReportType;
    report_count: number;
    total_weight: number | string;
    same_room_weight: number | string;
    top_entity_reporters: number;
};

const toReportAggregate = (row: ReportAggregateRow): ReportAggregate => ({
    targetId:           row.target_id,
    reportType:         row.report_type,
    reportCount:        row.report_count,
    // numeric 型は文字列で返ることがあるので数値化する
    totalWeight:        Number(row.total_weight),
    sameRoomWeight:     Number(row.same_room_weight),
    topEntityReporters: row.top_entity_reporters,
});

export const getGlossReportAggregates = async (glossIds: string[]): Promise<ReportAggregate[]> => {
    if (glossIds.length === 0) return [];
    const { data, error } = await supabase.rpc('get_gloss_report_aggregates', { p_gloss_ids: glossIds });
    if (error) throw error;
    return ((data ?? []) as ReportAggregateRow[]).map(toReportAggregate);
};

export const getRoomReportAggregates = async (roomIds: string[]): Promise<ReportAggregate[]> => {
    if (roomIds.length === 0) return [];
    const { data, error } = await supabase.rpc('get_room_report_aggregates', { p_room_ids: roomIds });
    if (error) throw error;
    return ((data ?? []) as ReportAggregateRow[]).map(toReportAggregate);
};
