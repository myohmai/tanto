import { Gloss } from "@/app/components/card/Gloss";

import type { GlossData } from "@/app/types/gloss";
import type { UserRoomData } from "@/app/types";

import './ReplyList.scss'

import { useRef } from "react";

type Props = {
    glosses: GlossData[];
    users?: UserRoomData[];
    room?: {
        iconUrl: string | null | undefined;
        subIcon?: undefined;
    };
    onRefresh?: () => void;
    isLoading?: boolean;
    onFond?: (glossId: string) => void;
}

export const ReplyList = ({
    glosses,
    users,
    room,
    onRefresh,
    isLoading,
    onFond
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
                            onRoom: () => {},
                            onSalon: () => {},
                            onFond: () => onFond?.(gloss.glossId),
                            onReply: () => {},
                        }}
                        fond={{
                            isPressed: false,
                        }}
                        onSelect={() => {}}
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
