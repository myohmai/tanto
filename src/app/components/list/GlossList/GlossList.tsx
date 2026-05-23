import { Gloss } from "@/app/components/card/Gloss";

import type { GlossData } from "@/app/types/gloss";
import type { Report } from "@/app/types/report";
import type { NotificationResult } from "@/app/logic/report/calcNotification";

import './GlossList.scss'

import { useRef } from "react";

import { FondLevel } from "@/app/components/icons";
import { UserRoomData } from "@/app/types";

import { getCurrentUserId } from "@/repositories/currentUser";
import { useEffect, useState } from "react";

type GlossListRoom = {
    roomId?: string;
    iconUrl: string | null | undefined;
    subIcon?: { type: 'fond'; value: FondLevel } | undefined;
}

type Props = {
    glosses: GlossData[];

    user: UserRoomData[] | undefined;
    room: GlossListRoom | GlossListRoom[];

    scope: 'feed' | 'room' | 'salon';

    onGlossClick?: (glossId: string) => void;

    fond: {isPressed: (glossId: string) => boolean;};

    onSelect?: (glossId: string, reason: Report) => void;

    action: {
        onRoom: (gloss: GlossData) => void;
        onSalon: (gloss: GlossData) => void;
        onFond: (glossId: string) => void;
        onReply: (gloss: GlossData) => void;
    }

    onRefresh?: () => void;
    isLoading?: boolean;
    onBlock?: (userId: string) => void;

    blockedUserIds: Set<string>;
    notifications?: Record<string, NotificationResult | null>;
    onRevaluation?: {
        onYes: (glossId: string) => void;
        onNo: (glossId: string) => void;
    };
}

export const GlossList = ({
    glosses,
    user,
    room,
    scope,
    onGlossClick,
    action,
    fond,
    onSelect,
    onRefresh,
    isLoading,
    onBlock,
    blockedUserIds,
    notifications,
    onRevaluation,
}: Props) => {
    const startY = useRef<number | null>(null);
    const pullDistance = useRef(0);
    const isTriggered = useRef(false);

    const safeUsers = user ?? [];
    const rooms = Array.isArray(room) ? room : [room];
    const [currentUserId, setCurrentUserId] = useState<string>("");
    
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
            className="gloss-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {glosses.map((gloss) =>{
                const u = safeUsers.find(
                    (user) => user.userId === gloss.userId && user.roomId === gloss.roomId
                );
                const r = rooms.find((room) => room.roomId === gloss.roomId) ?? rooms[0] ?? {
                    iconUrl: undefined,
                    subIcon: undefined,
                };
                const notifResult = notifications?.[gloss.glossId];

                return(
                    <Gloss
                        key={gloss.glossId}
                        onGlossClick={() => {
                            onGlossClick?.(gloss.glossId);
                        }}
                        glossData={gloss}
                        isInFeed={scope === "feed"}
                        isInRoom={scope === "room"}
                        isInSalon={scope === "salon"}
                        user={{
                            iconUrl: u?.iconUrl,
                            subIcon: u?.subIcon,
                        }}
                        room={r}
                        action={{
                            onRoom: handleRoom,
                            onSalon: handleSalon,
                            onFond: () => action.onFond(gloss.glossId),
                            onReply: handleReply,
                        }}
                        fond={fond}
                        notification={notifResult ? { type: notifResult.notificationType } : undefined}
                        revaluation={notifResult?.needsRevaluation ? onRevaluation : undefined}
                        onSelect={(reason) => onSelect?.(gloss.glossId, reason)}
                        onBlock={() => {onBlock?.(gloss.userId!)}}
                        isBlocked={blockedUserIds.has(gloss.userId!)}
                        isOwn={gloss.userId === currentUserId}
                        lang="ja"
                    />
                );
            })}
            {isLoading && (
                <div className="gloss-list__loading">
                    Loading...
                </div>
            )}
            {glosses.length === 0 && !isLoading && (
                <div className="gloss-list__empty">
                    <div>No glosses yet</div>

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
