import { Gloss } from "@/app/components/card/Gloss";

import type { GlossData } from "@/app/types/gloss";
import type { Report } from "@/app/types/report";
import type { UserRoomData } from "@/app/types";

import './ReplyList.scss'

import { getCurrentUserId } from "@/repositories/currentUser";
import { useEffect, useState } from "react";

import { useRef } from "react";

type Props = {
    glosses: GlossData[];
    users?: UserRoomData[];
    room?: {
        iconUrl: string | null | undefined;
        subIcon?: undefined;
    };
    fond: {isPressed: (glossId: string) => boolean;};
    onSelect?: (glossId: string, reason: Report) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    action: {
        onRoom: (glossData: GlossData) => void;
        onSalon: (glossData: GlossData) => void;
        onFond: (glossId: string) => void;
        onReply: (glossData: GlossData) => void;
    };
    onBlock?: (userId: string) => void;

    blockedUserIds: Set<string>; 
}


export const ReplyList = ({
    glosses,
    users,
    room,
    fond,
    onSelect,
    onRefresh,
    isLoading,
    action,
    onBlock,
    blockedUserIds
}: Props) => {
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const startY = useRef<number | null>(null);
    const pullDistance = useRef(0);
    const isTriggered = useRef(false);

    useEffect(() => {
        getCurrentUserId().then(setCurrentUserId);
    }, []);

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
    const handleRoom = (gloss: GlossData) => action.onRoom(gloss);
    const handleSalon = (gloss: GlossData) => action.onSalon(gloss);
    const handleReply = (gloss: GlossData) => action.onReply(gloss);
    return (
        <div
            className="reply-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {glosses.map((gloss) => {
                const user = users?.find(
                    (user) =>
                        user.userId === gloss.userId &&
                        user.roomId === gloss.roomId
                );

                return (
                    <Gloss
                        key={gloss.glossId}
                        glossData={gloss}
                        isInFeed={false}
                        isInRoom={false}
                        isInSalon={true}
                        user={{
                            iconUrl: user?.iconUrl,
                            subIcon: user?.subIcon
                        }}
                        room={{
                            iconUrl: room?.iconUrl,
                            subIcon: room?.subIcon
                        }}
                        action={{
                            onRoom: handleRoom,
                            onSalon: handleSalon,
                            onFond: () => action.onFond(gloss.glossId),
                            onReply: handleReply,
                        }}
                        fond={fond}
                        onSelect={(reason) => onSelect?.(gloss.glossId, reason)}
                        onBlock={() => onBlock?.(gloss.userId!)}
                        isBlocked={blockedUserIds.has(gloss.userId!)}
                        isOwn={gloss.userId === currentUserId}
                        lang="ja"
                    />
                );
            })}
            {isLoading && (
                <div className="reply-list__loading">
                    Loading...
                </div>
            )}
            

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
    )
}
