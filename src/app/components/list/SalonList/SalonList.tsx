import { SalonCard } from "@/app/components/card/SalonCard";

import type { SalonData } from "@/app/types/salon";

import './SalonList'

import { useRef } from "react";

type SalonWithMeta = SalonData & {
    latestPostedAt?: string;
    latestImages?: string[];
    glossCount?: number;
};

type Props = {
    salons: SalonWithMeta[];
    onClick: (value: SalonWithMeta) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const SalonList = ({
    salons,
    onClick,
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
            className="salon-list"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {salons.map((salon) => (
                <SalonCard
                    key={salon.salonId}
                    salonData={salon}
                    onSalon={() => {onClick(salon)}}
                    latestPostedAt={salon.latestPostedAt ?? ""}
                    glossCount={salon.glossCount ?? 0}
                    latestImages={salon.latestImages ?? []}
                />
            ))}

            {isLoading && (
                <div className="salon-list__loading">
                    Loading...
                </div>
            )}
            {salons.length === 0 && !isLoading && (
                <div className="salon-list__empty">
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