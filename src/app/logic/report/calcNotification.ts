import type { ReportType } from "@/app/types/report";
import type { NotificationType } from "@/app/components/evaluation/Notification";
import type { ReportAggregate } from "@/repositories/reportAggregate";

// 通報判定(興味関心の偏り検知)
//
// 通報者ごとの重み・同Room判定・共通Entity数の集計は、他ユーザーの個人データが必要なため
// DB 関数(supabase/migrations/20260929000003_report_aggregates.sql)で行う。
// ここでは集計結果から「どの注意書きを出すか」だけを決める。

const SAME_ROOM_THRESHOLD = 3;       // 同じ Room のメンバーからの通報(重み合計)
const SPECIFIC_ENTITY_THRESHOLD = 3; // Room 外の通報者のうち、同じ Entity に興味を持つ人数
const GLOBAL_THRESHOLD = 5;          // 全通報者の重み合計
// DIS_INTEREST_WEIGHT(0.3)は DB 側の集計で適用済み

// 深刻度順。先にマッチしたものを採用する
const REPORT_TYPE_PRIORITY: ReportType[] = [
    'adult',
    'identifiable',
    'offensive',
    'inappropriate',
    'unverified',
];

export type NotificationResult = {
    notificationType: NotificationType;
    needsRevaluation: boolean;
    isDeletionCandidate: boolean;
};

const calcForType = (agg: ReportAggregate): NotificationResult | null => {
    const sameRoomDominant = agg.sameRoomWeight >= SAME_ROOM_THRESHOLD;
    const specificEntityDominant = agg.topEntityReporters >= SPECIFIC_ENTITY_THRESHOLD;
    const global = agg.totalWeight >= GLOBAL_THRESHOLD;

    if (!sameRoomDominant && !specificEntityDominant && !global) return null;

    // 特定の層(Room 外の同じ Entity のファン)だけが通報している
    const onlySpecific = specificEntityDominant && !sameRoomDominant;

    switch (agg.reportType) {
        case 'offensive':
            return { notificationType: onlySpecific ? 'specific' : 'uncomfortable', needsRevaluation: false, isDeletionCandidate: false };

        case 'unverified':
            return { notificationType: onlySpecific ? 'specific' : 'unreliable', needsRevaluation: false, isDeletionCandidate: false };

        case 'inappropriate':
            return { notificationType: onlySpecific ? 'divided' : 'uncomfortable', needsRevaluation: false, isDeletionCandidate: false };

        case 'identifiable':
            return { notificationType: 'sensitive', needsRevaluation: true, isDeletionCandidate: false };

        case 'adult':
            return {
                notificationType: 'adult',
                needsRevaluation: !global,
                isDeletionCandidate: global,
            };
    }
};

// 1つの対象(Gloss または Room)の集計行から判定する
export const calcNotificationFromAggregates = (
    aggregates: ReportAggregate[]
): NotificationResult | null => {
    for (const reportType of REPORT_TYPE_PRIORITY) {
        const agg = aggregates.find(a => a.reportType === reportType);
        if (!agg || agg.reportCount === 0) continue;

        const result = calcForType(agg);
        if (result) return result;
    }
    return null;
};
