import { RoomCard } from "@/app/components/card/RoomCard";
import { getRoomSubIcon } from "@/app/logic/room/roomSubIcon";

import type { RoomData, UserRoomData } from "@/app/types";

import './RoomList.scss'

import { useRef } from "react";

type RoomWithMeta = RoomData & {
    latestPostedAt?: string;
    latestImages?: string[];
};

type Props = {
    rooms: RoomWithMeta[];
    scope: 'feed' | 'dashboard';
    users?: UserRoomData[];
    onRoom: (roomId: string) => void;
    onEdit?: (roomId: string) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const RoomList = ({
    rooms,
    scope,
    users,
    onRoom,
    onEdit,
    onRefresh,
    isLoading,
}: Props) => {
    const startY = useRef<number | null>(null);
    const pullDistance = useRef(0);
    const isTriggered = useRef(false);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop !== 0) return;
            startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (startY.current === null) return;

        const currentY = e.touches[0].clientY;
        pullDistance.current = currentY - startY.current;

        if (pullDistance.current > 10 && !isTriggered.current) {
            isTriggered.current = true;
            onRefresh?.();
        }
    };
    const handleTouchEnd = () => {
        startY.current = null;
        pullDistance.current = 0;
        isTriggered.current = false;
    };
    return (
        <div 
            className="room-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {rooms.map((room) => {
                const user = users?.find((user) => user.roomId === room.roomId);
                const displayUser = user ?? room.roomHost;

                return (
                    <RoomCard
                        key={room.roomId}
                        room={{
                            iconUrl: room.roomIconUrl,
                            subIcon: getRoomSubIcon(room, rooms),
                        }}
                        user={{
                            iconUrl: displayUser?.iconUrl ?? undefined,
                            subIcon: displayUser?.subIcon ?? undefined,
                        }}
                        roomName={room.roomName}
                        userName={displayUser?.userName ?? ""}
                        onRoom={() => onRoom(room.roomId)}
                        onEdit={() => onEdit?.(room.roomId)}
                        latestPostedAt={room.latestPostedAt}
                        glossCount={room.glossCount}
                        latestImages={room.latestImages}
                        isInDashboard={scope === 'dashboard'}
                        isOpenRoom={room.isOpenRoom}
                    />
                );
            })}

            {isLoading && (
                <div className="room-list__loading">
                    Loading...
                </div>
            )}
            {rooms.length === 0 && !isLoading && (
                <div className="room-list__empty">
                    <div>No rooms yet</div>

                    {onRefresh && (
                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                onRefresh?.();
                            }}
                        >
                            Refresh
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
