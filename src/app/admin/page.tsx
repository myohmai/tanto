"use client";
import { useRouter } from 'next/navigation';
import './admin.scss';

export default function AdminPage() {
    const router = useRouter();

    return (
        <div className="admin-page bg-color-primary text-color-primary">
            <h1 className="admin-page__title">管理者ページ</h1>
            <div className="admin-page__menu">
                <button
                    type="button"
                    className="admin-page__menu-item bg-color-secondary"
                    onClick={() => router.push('/admin/room/new')}
                >
                    <span className="admin-page__menu-label">OpenRoom を作成</span>
                    <span className="admin-page__menu-sub">アーティスト・チャンネルに紐づくRoomを作成</span>
                </button>
                <button
                    type="button"
                    className="admin-page__menu-item bg-color-secondary"
                    onClick={() => router.push('/admin/reports')}
                >
                    <span className="admin-page__menu-label">ユーザー報告一覧</span>
                    <span className="admin-page__menu-sub">バグ報告・削除依頼・問い合わせの管理</span>
                </button>
                <button
                    type="button"
                    className="admin-page__menu-item bg-color-secondary"
                    onClick={() => router.push('/admin/room-reports')}
                >
                    <span className="admin-page__menu-label">Roomへの報告一覧</span>
                    <span className="admin-page__menu-sub">adult / offensive など ReportMenu 経由のRoom報告</span>
                </button>
                <button
                    type="button"
                    className="admin-page__menu-item bg-color-secondary"
                    onClick={() => router.push('/admin/gloss-reports')}
                >
                    <span className="admin-page__menu-label">グロスへの報告一覧</span>
                    <span className="admin-page__menu-sub">adult / offensive など ReportMenu 経由のグロス報告</span>
                </button>
                <button
                    type="button"
                    className="admin-page__menu-item bg-color-secondary"
                    onClick={() => router.push('/admin/open-room-requests')}
                >
                    <span className="admin-page__menu-label">OpenRoom 要望 / 一覧</span>
                    <span className="admin-page__menu-sub">ユーザーからの要望と既存OpenRoomの確認</span>
                </button>
            </div>
        </div>
    );
}
