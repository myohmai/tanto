import { Gloss } from "@/app/components/card/Gloss";

import type { GlossData } from "@/app/types/gloss";

import './GlossList.scss'

import { useRef } from "react";

type Props = {
    glosses: GlossData[];

    scope: 'feed' | 'room' | 'salon';

    onRefresh?: () => void;
    isLoading?: boolean;
}

export const GlossList = ({
    glosses,
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
            className="gloss-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {glosses.map((gloss) => (
                <Gloss
                    key={gloss.glossId}
                    glossData={gloss}
                    isInFeed={scope === "feed"}
                    isInRoom={scope === "room"}
                    isInSalon={scope === "salon"}
                    user={{
                        iconUrl: "",
                        subIcon: undefined
                    }}
                    room={{
                        iconUrl: "",
                        subIcon: undefined
                    }}
                    action={{
                        onRoom: () => {},
                        onSalon: () => {},
                        onFond: () => {},
                        onReply: () => {},
                    }}
                    fond={{
                        isPressed: false,
                    }}
                    onSelect={() => {}}
                    lang="ja"
                />
            ))}
            {isLoading && (
                <div className="gloss-list__loading">
                    Loading...
                </div>
            )}
            {glosses.length === 0 && !isLoading && (
                <div className="gloss-list__empty">
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