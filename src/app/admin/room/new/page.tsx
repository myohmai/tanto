"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateOpenRoom } from '@/app/components/room/OpenRoomSetting/CreateOpenRoom';
import { saveRoom } from '@/repositories/room';
import { upsertEntity, getEntityByExternalId } from '@/repositories/entity';
import { toggleJoinRoom } from '@/repositories/userRoom';
import { addUserRoomEntities } from '@/repositories/userRoomEntity';
import { getCurrentUserId } from '@/repositories/currentUser';
import type { RoomData } from '@/app/types/room';
import type { Entity } from '@/app/types/entity';

export default function AdminCreateOpenRoomPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (room: RoomData, entity: Entity) => {
        setError(null);
        try {
            // 同一外部IDのEntityが既に存在するか確認
            let resolvedEntityId = entity.entityId;
            if (entity.externalService && entity.externalId) {
                const existing = await getEntityByExternalId(entity.externalService, entity.externalId);
                if (existing) {
                    resolvedEntityId = existing.entityId;
                } else {
                    resolvedEntityId = await upsertEntity(entity);
                }
            } else {
                resolvedEntityId = await upsertEntity(entity);
            }

            const roomWithEntity: RoomData = {
                ...room,
                entityIds: [resolvedEntityId],
            };

            await saveRoom(roomWithEntity);

            // 管理者を最初のメンバーとして参加させる（任意）
            const adminId = await getCurrentUserId();
            if (adminId) {
                await toggleJoinRoom({
                    userId:   adminId,
                    roomId:   room.roomId,
                    roomName: room.roomName,
                    iconUrl:  undefined,
                    subIcon:  undefined,
                    userName: 'Admin',
                });
                await addUserRoomEntities(adminId, room.roomId, [resolvedEntityId]);
            }

            router.push(`/room/${room.roomId}`);
        } catch (e) {
            console.error('OpenRoom creation failed:', e);
            setError(e instanceof Error ? e.message : 'OpenRoom の作成に失敗しました');
        }
    };

    return (
        <>
            {error && (
                <div style={{ color: 'red', padding: '8px 16px' }}>{error}</div>
            )}
            <CreateOpenRoom onCreateOpenRoom={handleCreate} />
        </>
    );
}
