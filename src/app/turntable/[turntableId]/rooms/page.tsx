"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RoomList } from "@/app/components/list/RoomList";
import { getTurntableById, getRoomIdsByVideoId, getRoomIdsByMusicUrl } from "@/repositories/turntable";
import { getRoomsByIds } from "@/repositories/room";
import { calcRoomMeta } from "@/app/logic/room/calcMeta";
import { getProcessedGlosses } from "@/app/logic/gloss/calcGloss";
import { getCurrentUserId } from "@/repositories/currentUser";
import { getUserRoomsByUser } from "@/repositories/userRoom";

import type { RoomData } from "@/app/types";
import { BackButton } from "@/app/components/buttons/BackButton";

import "./page.scss";

export default function Page({ params }: { params: Promise<{ turntableId: string }> }) {
    const { turntableId } = use(params);
    const router = useRouter();

    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [glosses, setGlosses] = useState<any[]>([]);
    const [userRooms, setUserRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mediaTitle, setMediaTitle] = useState<string>("");

    const enrichedRooms = calcRoomMeta(rooms, glosses, userRooms);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);

            const turntable = await getTurntableById(turntableId);
            if (!turntable) {
                setIsLoading(false);
                return;
            }

            let roomIds: string[] = [];

            if (turntable.type === "video" && turntable.video) {
                setMediaTitle(turntable.video.title);
                roomIds = await getRoomIdsByVideoId(turntable.video.videoId);
            } else if (turntable.type === "music" && turntable.music) {
                setMediaTitle(turntable.music.title);
                roomIds = await getRoomIdsByMusicUrl(turntable.music.url);
            }

            const fetchedRooms = await getRoomsByIds(roomIds);
            setRooms(fetchedRooms);

            try {
                const glossData = await getProcessedGlosses();
                setGlosses(glossData);
            } catch {}

            try {
                const uid = await getCurrentUserId();
                const userRoomData = await getUserRoomsByUser(uid);
                setUserRooms(userRoomData);
            } catch {}

            setIsLoading(false);
        };

        load();
    }, [turntableId]);

    return (
        <div>
            <div className="turntable-header bg-color-primary text-color-primary padding-sm-md inline-md">
                <BackButton onClick={() => router.back()}/>
                {mediaTitle && <span className="text-color-secondary">{mediaTitle}</span>}
            </div>
            <RoomList
                rooms={enrichedRooms}
                scope="feed"
                isLoading={isLoading}
                onRoom={(roomId) => router.push(`/room/${roomId}`)}
            />
        </div>
    );
}
