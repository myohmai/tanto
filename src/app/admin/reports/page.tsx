"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getContacts, updateContactStatus } from '@/repositories/contact';
import type { UserContact, ContactStatus } from '@/app/types/contact';
import '../admin.scss';
import './reports.scss';

const STATUS_LABELS: Record<ContactStatus, string> = {
    pending: '未対応',
    reviewed: '確認済み',
    resolved: '解決済み',
};

const TYPE_LABELS: Record<UserContact['type'], string> = {
    bug: 'バグ報告',
    deletion: '削除依頼',
    open_room: 'OpenRoom要望',
};

const NEXT_STATUS: Record<ContactStatus, ContactStatus> = {
    pending: 'reviewed',
    reviewed: 'resolved',
    resolved: 'pending',
};

export default function AdminReportsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<UserContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ContactStatus | 'all'>('all');

    useEffect(() => {
        getContacts()
            .then(setContacts)
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (contact: UserContact) => {
        const next = NEXT_STATUS[contact.status];
        await updateContactStatus(contact.id, next);
        setContacts(prev =>
            prev.map(c => c.id === contact.id ? { ...c, status: next } : c)
        );
    };

    const filtered = filter === 'all'
        ? contacts
        : contacts.filter(c => c.status === filter);

    return (
        <div className="admin-page bg-color-primary text-color-primary">
            <div className="admin-reports__header">
                <button type="button" className="admin-reports__back" onClick={() => router.push('/admin')}>
                    ← 管理者ページへ
                </button>
                <h1 className="admin-page__title">ユーザー報告一覧</h1>
            </div>

            <div className="admin-reports__filters">
                {(['all', 'pending', 'reviewed', 'resolved'] as const).map(s => (
                    <button
                        key={s}
                        type="button"
                        className={`admin-reports__filter-btn ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s === 'all' ? 'すべて' : STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="admin-reports__empty">読み込み中...</p>
            ) : filtered.length === 0 ? (
                <p className="admin-reports__empty">報告はありません</p>
            ) : (
                <div className="admin-reports__list">
                    {filtered.map(contact => (
                        <div key={contact.id} className="admin-reports__item bg-color-secondary">
                            <div className="admin-reports__item-header">
                                <span className={`admin-reports__type admin-reports__type--${contact.type}`}>
                                    {TYPE_LABELS[contact.type]}
                                </span>
                                <span className={`admin-reports__status admin-reports__status--${contact.status}`}>
                                    {STATUS_LABELS[contact.status]}
                                </span>
                            </div>
                            <p className="admin-reports__title">{contact.title}</p>
                            <p className="admin-reports__body">{contact.body}</p>
                            <div className="admin-reports__item-footer">
                                <span className="admin-reports__date">
                                    {new Date(contact.createdAt).toLocaleDateString('ja-JP')}
                                </span>
                                <button
                                    type="button"
                                    className="admin-reports__action-btn"
                                    onClick={() => handleStatusChange(contact)}
                                >
                                    → {STATUS_LABELS[NEXT_STATUS[contact.status]]}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
