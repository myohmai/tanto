import { RoomCard } from "@/app/components/card/RoomCard";

import type { RoomData } from "@/app/types/room";

import './RoomList.scss'

import { useRef } from "react";

type Props = {
    rooms: RoomData[];
    scope: 'feed' | 'dashboard';
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const RoomList = ({
    rooms,
    scope,
    onRefresh,
    isLoading
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
            {rooms.map((room) => (
                <RoomCard
                    room={{
                        iconUrl: room.roomIconUrl
                    }}
                    user={{}}
                    roomName={room.roomName}
                    userName=""
                    onRoom={()=>{}}
                    onEdit={() => {}}
                    latestPostedAt=""
                    glossCount={0}
                    latestImages={[]}
                    isInDashboard={scope === 'dashboard'}
                    />
            ))}

            {isLoading && (
                <div className="room-list__loading">
                    Loading...
                </div>
            )}
            {rooms.length === 0 && !isLoading && (
                <div className="room-list__empty">
                    <div>No posts yet</div>

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