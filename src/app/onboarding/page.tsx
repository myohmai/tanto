"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getRooms } from "@/repositories/room";
import { getCurrentUserId } from "@/repositories/currentUser";
import { isJoined } from "@/repositories/userRoom";
import { OnboardRoomCard } from "@/app/components/card/OnboardRoomCard/OnboardRoomCard";
import type { RoomData } from "@/app/types/room";
import { getRoomSubIcon } from "@/app/logic/room/roomSubIcon";
import "./page.scss";
import { SubmitButton } from "../components/buttons/SubmitButton";

export default function OnboardingPage() {
    const router = useRouter();
    const t = useTranslations('onboarding');
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const uid = await getCurrentUserId();
            const allRooms = await getRooms();
            const publicRooms = allRooms.filter(r => r.roomVisibility === "public");
            setRooms(publicRooms);

            const joined = new Set<string>();
            await Promise.all(
                publicRooms.map(async (r) => {
                    const ok = await isJoined(r.roomId, uid);
                    if (ok) joined.add(r.roomId);
                })
            );
            setJoinedIds(joined);
            setLoading(false);
        };
        load();
    }, []);

    const handleCardToggle = (room: RoomData) => {
        if (joinedIds.has(room.roomId)) {
            router.push(`/room/${room.roomId}`);
        } else {
            router.push(`/room/${room.roomId}/nickname?returnTo=/onboarding`);
        }
    };

    return (
        <div className="onboarding bg-color-primary text-color-primary">
            <div className="onboarding__inner">
                <h1 className="onboarding__title">{t('title')}</h1>
                <p className="onboarding__description">{t('description')}</p>

                {loading ? (
                    <div className="onboarding__loading">読み込み中...</div>
                ) : (
                    <div className="onboarding__grid">
                        {rooms.map((room) => (
                            <OnboardRoomCard
                                key={room.roomId}
                                roomName={room.roomName}
                                iconUrl={room.roomIconUrl}
                                subIcon={getRoomSubIcon(room, rooms)}
                                bannerUrl={room.roomBannerUrl}
                                joined={joinedIds.has(room.roomId)}
                                onToggle={() => handleCardToggle(room)}
                            />
                        ))}
                    </div>
                )}
                <SubmitButton label={joinedIds.size > 0 ? t('start') : t('skip')} onClick={() => router.push("/feed")} />
            </div>
        </div>
    );
}
