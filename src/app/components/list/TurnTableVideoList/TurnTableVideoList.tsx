import { TurnTableVideoCard } from "@/app/components/card/TurnTableVideoCard";
import { TurnTableData } from "@/app/types/turntable";
import "./TurnTableVideoList.scss";
import { useRef } from "react";

type Props = {
    turntables: TurnTableData[];
    onRefresh?: () => void;
    onDelete?: (id: string) => void;
    onSeeAlso?: (turntableId: string) => void;
    isLoading?: boolean;
};

export const TurnTableVideoList = ({
    turntables,
    onRefresh,
    onDelete,
    onSeeAlso,
    isLoading
}: Props) => {
    const videos = turntables.filter(
        (t) => t.type === "video"
    );

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
            className="turn-table-video-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {videos.map((video) => (
                <TurnTableVideoCard
                    key={video.id}
                    turntableData={video}
                    hasSeeAlso={!!onSeeAlso}
                    onSeeAlso={() => onSeeAlso?.(video.id)}
                    onDelete={onDelete ? () => onDelete(video.id) : undefined}
                />
            ))}

            {isLoading && (
                <div className="turn-table-video-list__loading">
                    Loading...
                </div>
            )}

            {videos.length === 0 && !isLoading && (
                <div className="turn-table-video-list__empty">
                    <div>No videos yet</div>

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
    );
};