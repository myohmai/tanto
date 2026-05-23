"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRooms, deleteRoom } from '@/repositories/room';
import type { RoomData } from '@/app/types/room';
import type { ReportType } from '@/app/types/report';
import '../admin.scss';
import './room-reports.scss';

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    offensive: '不快なコンテンツ',
    unverified: '未確認の情報',
    inappropriate: '不適切なコンテンツ',
    identifiable: '個人を特定できる情報',
    adult: 'アダルトコンテンツ',
};

type RoomWithReports = RoomData & { reportCount: number };

export default function AdminRoomReportsPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<RoomWithReports[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        getRooms()
            .then(all => {
                const reported = all
                    .filter(r => r.reports.length > 0)
                    .map(r => ({ ...r, reportCount: r.reports.length }))
                    .sort((a, b) => b.reportCount - a.reportCount);
                setRooms(reported);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (roomId: string) => {
        if (!confirm('このRoomを削除しますか？')) return;
        setDeletingId(roomId);
        try {
            await deleteRoom(roomId);
            setRooms(prev => prev.filter(r => r.roomId !== roomId));
        } finally {
            setDeletingId(null);
        }
    };

    const countByType = (room: RoomData) => {
        const counts: Partial<Record<ReportType, number>> = {};
        for (const r of room.reports) {
            counts[r.type] = (counts[r.type] ?? 0) + 1;
        }
        return counts;
    };

    return (
        <div className="admin-page bg-color-primary text-color-primary">
            <div className="room-reports__header">
                <button type="button" className="room-reports__back" onClick={() => router.push('/admin')}>
                    ← 管理者ページへ
                </button>
                <h1 className="admin-page__title">コンテンツ報告一覧</h1>
                <p className="room-reports__sub">報告が多い順に表示しています</p>
            </div>

            {loading ? (
                <p className="room-reports__empty">読み込み中...</p>
            ) : rooms.length === 0 ? (
                <p className="room-reports__empty">報告されたRoomはありません</p>
            ) : (
                <div className="room-reports__list">
                    {rooms.map(room => {
                        const typeCounts = countByType(room);
                        const isOpen = expanded === room.roomId;
                        return (
                            <div key={room.roomId} className="room-reports__item bg-color-secondary">
                                <button
                                    type="button"
                                    className="room-reports__item-main"
                                    onClick={() => setExpanded(isOpen ? null : room.roomId)}
                                >
                                    <div className="room-reports__room-info">
                                        {room.roomIconUrl && (
                                            <img
                                                src={room.roomIconUrl}
                                                alt={room.roomName}
                                                className="room-reports__room-icon"
                                            />
                                        )}
                                        <div>
                                            <p className="room-reports__room-name">{room.roomName}</p>
                                            <p className="room-reports__room-id">{room.roomId}</p>
                                        </div>
                                    </div>
                                    <span className="room-reports__count">
                                        {room.reportCount}件
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="room-reports__detail">
                                        <div className="room-reports__type-breakdown">
                                            {(Object.entries(typeCounts) as [ReportType, number][]).map(([type, count]) => (
                                                <div key={type} className="room-reports__type-row">
                                                    <span className={`room-reports__type-badge room-reports__type-badge--${type}`}>
                                                        {REPORT_TYPE_LABELS[type]}
                                                    </span>
                                                    <span className="room-reports__type-count">{count}件</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="room-reports__actions">
                                            <button
                                                type="button"
                                                className="room-reports__edit-btn"
                                                onClick={() => router.push(`/admin/room/${room.roomId}/edit`)}
                                            >
                                                編集
                                            </button>
                                            <button
                                                type="button"
                                                className="room-reports__delete-btn"
                                                onClick={() => handleDelete(room.roomId)}
                                                disabled={deletingId === room.roomId}
                                            >
                                                {deletingId === room.roomId ? '削除中...' : 'Roomを削除'}
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
