import type { Report, ReportType } from "@/app/types/report";
import type { Entity, UserRoomEntity, UserDisInterest } from "@/app/types/entity";
import type { NotificationType } from "@/app/components/evaluation/Notification";
import { resolveEntityId, getRelatedEntityIds } from "./resolveEntity";

const SAME_ROOM_THRESHOLD = 3;
const SPECIFIC_ENTITY_THRESHOLD = 3;
const GLOBAL_THRESHOLD = 5;
const DIS_INTEREST_WEIGHT = 0.3;

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

export type ReportContext = {
    reports: Report[];
    roomId: string;
    authorId: string;
    roomEntityIds: string[];
    entities: Entity[];
    userRoomEntities: UserRoomEntity[];
    userDisInterests: UserDisInterest[];
};

// DisInterest が Room の entityId と重なる reporter は重みを下げる
const calcWeight = (
    reporterId: string,
    roomEntityIds: string[],
    userDisInterests: UserDisInterest[],
    entities: Entity[]
): number => {
    const disInterestIds = userDisInterests
        .filter(d => d.userId === reporterId)
        .map(d => resolveEntityId(d.entityId, entities));

    const expandedRoomIds = roomEntityIds.flatMap(id => getRelatedEntityIds(id, entities));
    const hasBias = expandedRoomIds.some(id => disInterestIds.includes(id));

    return hasBias ? DIS_INTEREST_WEIGHT : 1.0;
};

const isInSameRoom = (
    reporterId: string,
    roomId: string,
    userRoomEntities: UserRoomEntity[]
): boolean => {
    return userRoomEntities.some(
        ure => ure.userId === reporterId && ure.roomId === roomId
    );
};

// Room 外の reporter 群から最も共通する entityId を返す
const findDominantEntity = (
    reporterIds: string[],
    roomId: string,
    userRoomEntities: UserRoomEntity[],
    entities: Entity[]
): string | null => {
    const entityCounts: Record<string, number> = {};

    for (const reporterId of reporterIds) {
        const reporterEntities = userRoomEntities
            .filter(ure => ure.userId === reporterId && ure.roomId !== roomId)
            .map(ure => resolveEntityId(ure.entityId, entities));

        for (const entityId of [...new Set(reporterEntities)]) {
            entityCounts[entityId] = (entityCounts[entityId] ?? 0) + 1;
        }
    }

    const top = Object.entries(entityCounts).sort((a, b) => b[1] - a[1])[0];
    return top && top[1] >= SPECIFIC_ENTITY_THRESHOLD ? top[0] : null;
};

const calcForType = (
    reportType: ReportType,
    reports: Report[],
    ctx: ReportContext
): NotificationResult | null => {
    let sameRoomWeight = 0;
    let totalWeight = 0;
    const outsideRoomReporterIds: string[] = [];

    for (const report of reports) {
        const weight = calcWeight(report.reporterId, ctx.roomEntityIds, ctx.userDisInterests, ctx.entities);
        totalWeight += weight;

        if (isInSameRoom(report.reporterId, ctx.roomId, ctx.userRoomEntities)) {
            sameRoomWeight += weight;
        } else {
            outsideRoomReporterIds.push(report.reporterId);
        }
    }

    const dominantEntity = findDominantEntity(
        outsideRoomReporterIds,
        ctx.roomId,
        ctx.userRoomEntities,
        ctx.entities
    );

    const sameRoomDominant = sameRoomWeight >= SAME_ROOM_THRESHOLD;
    const specificEntityDominant = dominantEntity !== null;
    const global = totalWeight >= GLOBAL_THRESHOLD;

    if (!sameRoomDominant && !specificEntityDominant && !global) return null;

    switch (reportType) {
        case 'offensive':
            if (specificEntityDominant && !sameRoomDominant)
                return { notificationType: 'specific', needsRevaluation: false, isDeletionCandidate: false };
            return { notificationType: 'uncomfortable', needsRevaluation: false, isDeletionCandidate: false };

        case 'unverified':
            if (specificEntityDominant && !sameRoomDominant)
                return { notificationType: 'specific', needsRevaluation: false, isDeletionCandidate: false };
            return { notificationType: 'unreliable', needsRevaluation: false, isDeletionCandidate: false };

        case 'inappropriate':
            if (specificEntityDominant && !sameRoomDominant)
                return { notificationType: 'divided', needsRevaluation: false, isDeletionCandidate: false };
            return { notificationType: 'uncomfortable', needsRevaluation: false, isDeletionCandidate: false };

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

export const calcNotification = (ctx: ReportContext): NotificationResult | null => {
    for (const reportType of REPORT_TYPE_PRIORITY) {
        const typeReports = ctx.reports.filter(r => r.type === reportType);
        if (typeReports.length === 0) continue;

        const result = calcForType(reportType, typeReports, ctx);
        if (result) return result;
    }
    return null;
};
