"use client";
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditOpenRoom } from '@/app/components/room/OpenRoomSetting/EditOpenRoom';
import { getRoomById, saveRoom, deleteRoom } from '@/repositories/room';
import { getEntityById } from '@/repositories/entity';
import type { RoomData } from '@/app/types/room';
import type { Entity } from '@/app/types/entity';

export default function AdminEditOpenRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    const router = useRouter();

    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [entity, setEntity] = useState<Entity | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRoomById(roomId).then(async room => {
            if (!room) return;
            setRoomData(room);

            const entityId = room.entityIds[0];
            if (entityId) {
                const e = await getEntityById(entityId);
                setEntity(e);
            }
        });
    }, [roomId]);

    if (!roomData) return null;

    return (
        <>
            {error && (
                <div style={{ color: 'red', padding: '8px 16px' }}>{error}</div>
            )}
            <EditOpenRoom
                roomData={roomData}
                entity={entity}
                onSave={async updated => {
                    setError(null);
                    try {
                        await saveRoom(updated);
                        router.push(`/room/${roomId}`);
                    } catch (e) {
                        setError(e instanceof Error ? e.message : '保存に失敗しました');
                    }
                }}
                onDelete={async () => {
                    setError(null);
                    try {
                        await deleteRoom(roomId);
                        router.push('/hallway');
                    } catch (e) {
                        setError(e instanceof Error ? e.message : '削除に失敗しました');
                    }
                }}
            />
        </>
    );
}
