"use client";

import { useEffect, useMemo, useState } from "react";
import { calcNotificationFromAggregates, type NotificationResult } from "@/app/logic/report/calcNotification";
import {
    getGlossReportAggregates,
    getRoomReportAggregates,
    type ReportAggregate,
} from "@/repositories/reportAggregate";
import type { GlossData } from "@/app/types/gloss";
import type { RoomData } from "@/app/types/room";

const groupByTarget = (rows: ReportAggregate[]) =>
    rows.reduce<Record<string, ReportAggregate[]>>((acc, row) => {
        (acc[row.targetId] ??= []).push(row);
        return acc;
    }, {});

// 表示中の Gloss の通報判定。通報のある Gloss だけ DB で集計し、glossId → 判定結果 を返す。
// 通報が追加される(reports の件数が変わる)と取り直す。
export const useGlossNotifications = (
    glosses: GlossData[]
): Record<string, NotificationResult | null> => {
    const [aggregates, setAggregates] = useState<Record<string, ReportAggregate[]>>({});

    const reportedKey = glosses
        .filter(g => (g.reports?.length ?? 0) > 0)
        .map(g => `${g.glossId}:${g.reports?.length ?? 0}`)
        .sort()
        .join(",");

    useEffect(() => {
        if (!reportedKey) return;
        const glossIds = reportedKey.split(",").map(k => k.split(":")[0]);
        let cancelled = false;

        getGlossReportAggregates(glossIds)
            .then(rows => {
                if (!cancelled) setAggregates(groupByTarget(rows));
            })
            .catch(e => console.error("Failed to load gloss report aggregates:", e));

        return () => { cancelled = true; };
    }, [reportedKey]);

    return useMemo(
        () => Object.fromEntries(
            glosses.map(g => [
                g.glossId,
                g.reports?.length ? calcNotificationFromAggregates(aggregates[g.glossId] ?? []) : null,
            ])
        ),
        [glosses, aggregates]
    );
};

// Room の通報判定。room_reports は RLS で自分の分しか読めないため、件数に関係なく DB で集計する。
// reports の件数が変わる(自分が通報した)と取り直す。
export const useRoomNotification = (room: RoomData | null): NotificationResult | null => {
    const [aggregates, setAggregates] = useState<{ roomId: string; rows: ReportAggregate[] } | null>(null);

    const roomId = room?.roomId;
    const myReportCount = room?.reports?.length ?? 0;

    useEffect(() => {
        if (!roomId) return;
        let cancelled = false;

        getRoomReportAggregates([roomId])
            .then(rows => {
                if (!cancelled) setAggregates({ roomId, rows });
            })
            .catch(e => console.error("Failed to load room report aggregates:", e));

        return () => { cancelled = true; };
    }, [roomId, myReportCount]);

    return useMemo(() => {
        if (!roomId || aggregates?.roomId !== roomId) return null;
        return calcNotificationFromAggregates(aggregates.rows);
    }, [roomId, aggregates]);
};
