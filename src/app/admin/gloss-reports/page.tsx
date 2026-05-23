"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getReportedGlosses, deleteGloss } from '@/repositories/gloss';
import type { GlossData } from '@/app/types';
import type { ReportType } from '@/app/types/report';
import '../admin.scss';
import './gloss-reports.scss';

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    offensive: '不快なコンテンツ',
    unverified: '未確認の情報',
    inappropriate: '不適切なコンテンツ',
    identifiable: '個人を特定できる情報',
    adult: 'アダルトコンテンツ',
};

type GlossWithCount = GlossData & { reportCount: number };

export default function AdminGlossReportsPage() {
    const router = useRouter();
    const [glosses, setGlosses] = useState<GlossWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        getReportedGlosses()
            .then(data => {
                const sorted = data
                    .map(g => ({ ...g, reportCount: g.reports?.length ?? 0 }))
                    .sort((a, b) => b.reportCount - a.reportCount);
                setGlosses(sorted);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (glossId: string) => {
        if (!confirm('このグロスを削除しますか？')) return;
        setDeletingId(glossId);
        try {
            await deleteGloss(glossId);
            setGlosses(prev => prev.filter(g => g.glossId !== glossId));
        } finally {
            setDeletingId(null);
        }
    };

    const countByType = (gloss: GlossData) => {
        const counts: Partial<Record<ReportType, number>> = {};
        for (const r of gloss.reports ?? []) {
            counts[r.type] = (counts[r.type] ?? 0) + 1;
        }
        return counts;
    };

    return (
        <div className="admin-page bg-color-primary text-color-primary">
            <div className="gloss-reports__header">
                <button type="button" className="gloss-reports__back" onClick={() => router.push('/admin')}>
                    ← 管理者ページへ
                </button>
                <h1 className="admin-page__title">グロス報告一覧</h1>
                <p className="gloss-reports__sub">報告が多い順に表示しています</p>
            </div>

            {loading ? (
                <p className="gloss-reports__empty">読み込み中...</p>
            ) : glosses.length === 0 ? (
                <p className="gloss-reports__empty">報告されたグロスはありません</p>
            ) : (
                <div className="gloss-reports__list">
                    {glosses.map(gloss => {
                        const typeCounts = countByType(gloss);
                        const isOpen = expanded === gloss.glossId;
                        return (
                            <div key={gloss.glossId} className="gloss-reports__item bg-color-secondary">
                                <button
                                    type="button"
                                    className="gloss-reports__item-main"
                                    onClick={() => setExpanded(isOpen ? null : gloss.glossId)}
                                >
                                    <div className="gloss-reports__gloss-info">
                                        <p className="gloss-reports__content">{gloss.content}</p>
                                        <p className="gloss-reports__meta">
                                            {gloss.userName ?? '匿名'} · {gloss.roomName}
                                            {gloss.salonName ? ` · ${gloss.salonName}` : ''}
                                        </p>
                                    </div>
                                    <span className="gloss-reports__count">{gloss.reportCount}件</span>
                                </button>

                                {isOpen && (
                                    <div className="gloss-reports__detail">
                                        <div className="gloss-reports__type-breakdown">
                                            {(Object.entries(typeCounts) as [ReportType, number][]).map(([type, count]) => (
                                                <div key={type} className="gloss-reports__type-row">
                                                    <span className={`gloss-reports__type-badge gloss-reports__type-badge--${type}`}>
                                                        {REPORT_TYPE_LABELS[type]}
                                                    </span>
                                                    <span className="gloss-reports__type-count">{count}件</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="gloss-reports__actions">
                                            <button
                                                type="button"
                                                className="gloss-reports__view-btn"
                                                onClick={() => router.push(`/room/${gloss.roomId}/salon/${gloss.salonId}/gloss/${gloss.glossId}`)}
                                            >
                                                詳細を見る
                                            </button>
                                            <button
                                                type="button"
                                                className="gloss-reports__delete-btn"
                                                onClick={() => handleDelete(gloss.glossId)}
                                                disabled={deletingId === gloss.glossId}
                                            >
                                                {deletingId === gloss.glossId ? '削除中...' : 'グロスを削除'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
