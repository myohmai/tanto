'use client';

import { useEffect, useState } from 'react';
import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { UserCustomIcon } from '@/app/components/custom-icon/UserCustomIcon';
import { UserBlockIcon, CancelIcon } from '@/app/components/icons';
import { getBlocksWithRoom, toggleBlock, type BlockWithRoom } from '@/repositories/block';
import { getCurrentUserId } from '@/repositories/currentUser';

import './BlockedList.scss';

type Props = {
    onBack: () => void;
};

export const BlockedList = ({ onBack }: Props) => {
    const [blocks, setBlocks] = useState<BlockWithRoom[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            setCurrentUserId(uid);
            const data = await getBlocksWithRoom(uid);
            setBlocks(data);
        };
        load();
    }, []);

    const handleUnblock = async (targetUserId: string) => {
        if (!currentUserId) return;
        await toggleBlock({ userId: currentUserId, targetUserId });
        setBlocks(prev => prev.filter(b => b.targetUserId !== targetUserId));
    };

    return (
        <div className="blocked-list bg-color-primary">
            <SettingTopBar
                title="Blocked Users"
                icon={<UserBlockIcon className="icon-color-primary" />}
                onBack={onBack}
            />

            {blocks.length === 0 ? (
                <div className="blocked-list__empty text-color-secondary">
                    No blocked users
                </div>
            ) : (
                <ul className="blocked-list__items">
                    {blocks.map(block => {
                        const displayName = block.isAnonymous
                            ? 'Unknown'
                            : (block.targetSnapshotName ?? 'Unknown');

                        return (
                            <li key={block.targetUserId} className="blocked-list__item padding-sm-lg">
                                <div className="blocked-list__user">
                                    <UserCustomIcon
                                        iconUrl={block.targetSnapshotIcon}
                                        className="blocked-list__icon"
                                    />
                                    <div className="blocked-list__info">
                                        <span className="blocked-list__name text-color-primary">
                                            {displayName}
                                        </span>
                                        {block.roomName && (
                                            <span className="blocked-list__room text-color-secondary">
                                                {block.roomName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="blocked-list__unblock"
                                    onClick={() => handleUnblock(block.targetUserId)}
                                    aria-label="Unblock"
                                >
                                    <CancelIcon className="icon-color-secondary" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
