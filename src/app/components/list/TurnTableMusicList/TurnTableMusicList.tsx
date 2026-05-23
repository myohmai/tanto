import { TurnTableMediaCard } from "@/app/components/card/TurnTableMediaCard";
import { TurnTableData } from "@/app/types/turntable";
import "./TurnTableMusicList.scss";
import { useRef } from "react";

type Props = {
    turntables: TurnTableData[];
    onRefresh?: () => void;
    onDelete?: (id: string) => void;
    onSeeAlso?: (turntableId: string) => void;
    isLoading?: boolean;
};

export const TurnTableMusicList = ({
    turntables,
    onRefresh,
    onDelete,
    onSeeAlso,
    isLoading
}: Props) => {
    const musics = turntables.filter(
        (t) => t.type === "music"
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
            className="turn-table-music-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {musics.map((music) => (
                <TurnTableMediaCard
                    key={music.id}
                    turntableData={music}
                    hasSeeAlso={!!onSeeAlso}
                    onSeeAlso={() => onSeeAlso?.(music.id)}
                    primaryService={
                        music.music?.service ?? "youtube"
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
                    onDelete={onDelete ? () => onDelete(music.id) : undefined}
                />
            ))}

            {isLoading && (
                <div className="turn-table-music-list__loading">
                    Loading...
                </div>
            )}

            {musics.length === 0 && !isLoading && (
                <div className="turn-table-music-list__empty">
                    <div>No music yet</div>

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