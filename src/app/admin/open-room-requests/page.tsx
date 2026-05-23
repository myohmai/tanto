"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getContactsByType, updateContactStatus } from '@/repositories/contact';
import { getRooms } from '@/repositories/room';
import type { UserContact, ContactStatus } from '@/app/types/contact';
import type { RoomData } from '@/app/types/room';
import '../admin.scss';
import './open-room-requests.scss';

const STATUS_LABELS: Record<ContactStatus, string> = {
    pending: '未対応',
    reviewed: '確認済み',
    resolved: '解決済み',
};

const NEXT_STATUS: Record<ContactStatus, ContactStatus> = {
    pending: 'reviewed',
    reviewed: 'resolved',
    resolved: 'pending',
};

export default function AdminOpenRoomRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<UserContact[]>([]);
    const [openRooms, setOpenRooms] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'requests' | 'rooms'>('requests');

    useEffect(() => {
        Promise.all([
            getContactsByType('open_room'),
            getRooms().then(rooms => rooms.filter(r => r.isOpenRoom)),
        ]).then(([reqs, rooms]) => {
            setRequests(reqs);
            setOpenRooms(rooms);
        }).finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (contact: UserContact) => {
        const next = NEXT_STATUS[contact.status];
        await updateContactStatus(contact.id, next);
        setRequests(prev =>
            prev.map(r => r.id === contact.id ? { ...r, status: next } : r)
        );
    };

    return (
        <div className="admin-page bg-color-primary text-color-primary">
            <div className="open-room-req__header">
                <button type="button" className="open-room-req__back" onClick={() => router.push('/admin')}>
                    ← 管理者ページへ
                </button>
                <h1 className="admin-page__title">OpenRoom</h1>
            </div>

            <div className="open-room-req__tabs">
                <button
                    type="button"
                    className={`open-room-req__tab ${tab === 'requests' ? 'active' : ''}`}
                    onClick={() => setTab('requests')}
                >
                    要望一覧
                </button>
                <button
                    type="button"
                    className={`open-room-req__tab ${tab === 'rooms' ? 'active' : ''}`}
                    onClick={() => setTab('rooms')}
                >
                    OpenRoom一覧
                </button>
            </div>

            {loading ? (
                <p className="open-room-req__empty">読み込み中...</p>
            ) : tab === 'requests' ? (
                requests.length === 0 ? (
                    <p className="open-room-req__empty">OpenRoom要望はありません</p>
                ) : (
                    <div className="open-room-req__list">
                        {requests.map(req => (
                            <div key={req.id} className="open-room-req__item bg-color-secondary">
                                <div className="open-room-req__item-header">
                                    <p className="open-room-req__title">{req.title}</p>
                                    <span className={`open-room-req__status open-room-req__status--${req.status}`}>
                                        {STATUS_LABELS[req.status]}
                                    </span>
                                </div>
                                <p className="open-room-req__body">{req.body}</p>
                                <div className="open-room-req__item-footer">
                                    <span className="open-room-req__date">
                                        {new Date(req.createdAt).toLocaleDateString('ja-JP')}
                                    </span>
                                    <button
                                        type="button"
                                        className="open-room-req__action-btn"
                                        onClick={() => handleStatusChange(req)}
                                    >
                                        → {STATUS_LABELS[NEXT_STATUS[req.status]]}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                openRooms.length === 0 ? (
                    <p className="open-room-req__empty">OpenRoomはありません</p>
                ) : (
                    <div className="open-room-req__list">
                        {openRooms.map(room => (
                            <div key={room.roomId} className="open-room-req__room bg-color-secondary">
                                <div className="open-room-req__room-info">
                                    {room.roomIconUrl && (
                                        <img
                                            src={room.roomIconUrl}
                                            alt={room.roomName}
                                            className="open-room-req__room-icon"
                                        />
                                    )}
                                    <div>
                                        <p className="open-room-req__room-name">{room.roomName}</p>
                                        <p className="open-room-req__room-members">{room.roomMemberCount}人</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="open-room-req__action-btn"
                                    onClick={() => router.push(`/admin/room/${room.roomId}/edit`)}
                                >
                                    編集
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
