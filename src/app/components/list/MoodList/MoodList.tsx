import { TurnTableVideoCard } from "@/app/components/card/TurnTableVideoCard";
import { TurnTableMediaCard } from "@/app/components/card/TurnTableMediaCard";
import { TurnTableData } from "@/app/types/turntable";
import './MoodList.scss'
import React, { useRef } from "react";

type Props = {
    turntables: TurnTableData[];
    onRefresh?: () => void;
    isLoading?: boolean;
    onSeeAlso?: (turntableId: string) => void;
};

export const MoodList = ({
    turntables,
    onRefresh,
    isLoading,
    onSeeAlso,
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
            className="mood-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {turntables.map((turntable) => (
                <React.Fragment key={turntable.id}>
                {turntable.type === 'video' && (
                    <TurnTableVideoCard
                    turntableData={turntable}
                    hasSeeAlso={!!onSeeAlso}
                    onSeeAlso={() => onSeeAlso?.(turntable.id)}
                />)}
                {turntable.type === 'music' && (
                        <TurnTableMediaCard
                        turntableData={turntable}
                        hasSeeAlso={!!onSeeAlso}
                        onSeeAlso={() => onSeeAlso?.(turntable.id)}
                        primaryService={
                            turntable.music?.service ?? "youtube"
                        }
                        service={{
                            onYoutube: () => {},
                            onSpotify: () => {},
                            onAppleMusic: () => {}
                        }}
                        isPaused={false}
                        isMuted={false}
                        onPause={() => {}}
                        onMute={() => {}}
                        progress={0}
                />
                )}
                </React.Fragment>
            ))}

            {isLoading && (
                <div className="mood-list__loading">
                    Loading...
                </div>
            )}

            {turntables.length === 0 && !isLoading && (
                <div className="mood-list__empty">
                    <div>No media yet</div>

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