"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { SalonTopBar } from "@/app/components/bar/SalonTopBar";
import { TopicBoxBar } from "@/app/components/bar/TopicBoxBar";

import { getCurrentUserId } from "@/repositories/currentUser";

import { GlossList } from "@/app/components/list/GlossList";

import { AddGlossButton } from "@/app/components/buttons/AddGlossButton";

import { getRooms } from "@/repositories/room";
import { getSalons } from "@/repositories/salon";
import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getUserRoomData } from "@/repositories/userRoom";
import { toggleFond,  getAllFonds } from "@/repositories/fond";

import { GlossData, SalonData, type RoomData, type UserRoomData, type Fond } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string; salonId: string }>();
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    const [salonData, setSalonData] = useState<SalonData | null>(null);
    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [glossUsers, setGlossUsers] = useState<UserRoomData[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [fonds, setFonds] = useState<Fond[]>([]);
    const isPressed = (glossId: string) =>
        fonds.some(
            f => f.glossId === glossId && f.userId === currentUserId
        );
    const handleFond = async (glossId: string) => {
        await toggleFond(glossId, "currentUser");

        const [glosses, newFonds] = await Promise.all([
            getGlosses(),
            getAllFonds(),
        ]);

        setGlossData(glosses.filter(g => g.salonId === params.salonId));
        setFonds(newFonds);
    }
    const handleReport = (glossId: string, report: Report) => {
        setGlossData(prev =>
            prev.map(gloss =>
                gloss.glossId === glossId
                    ? {
                        ...gloss,
                        reports: [
                            ...(gloss.reports ?? []),
                            report,
                        ],
                    }
                    : gloss
            )
        );
    };
    useEffect(() => {
    getRooms().then((rooms) => {
        const room = rooms.find(r => r.roomId === params.roomId);
        setRoomData(room ?? null);
    });

    getSalons().then((salons) => {
        const salon = salons.find(
            s => s.roomId === params.roomId && s.salonId === params.salonId
        );
        setSalonData(salon ?? null);
    });

    getGlosses().then((glosses) => {
            const filtered = glosses.filter(g => g.salonId === params.salonId);
            setGlossData(filtered);
        });
    }, [params]);
    
    
    useEffect(() => {
        getAllFonds().then(setFonds);
    }, []);

    useEffect(() => {
        getUserRoomData().then((users) => {
            setGlossUsers(users);
        });
    },[]);

    useEffect(() => {
        getCurrentUserId().then((currentUserId) => {
            setCurrentUserId(currentUserId);
        });
    }, []);

    if (!roomData || !salonData) return null;

    const isHost = roomData.roomHost?.userId === currentUserId;

    return (
        <div className="salon-page">
            <div className="salon-page__sticky">
                <SalonTopBar
                    roomName={roomData?.roomName ?? ""}
                    salonName={salonData.salonName}
                    onBack={() => router.back()}
                    onRoom={() => router.push(`/room/${params.roomId}`)}
                    onSalon={() => router.refresh()}
                    onPin={() => {}}
                    onEdit={() =>
                        router.push(`/room/${params.roomId}/salon/${params.salonId}/edit`)
                    }
                    onMute={() => {}}
                    isHost={isHost}
                />
            </div>
            {salonData.isTopicBox && (
                <TopicBoxBar
                    isInSalon={true}
                    isHost={isHost}
                    onView={() => router.push(`/room/${params.roomId}/salon/${params.salonId}/topic`)}
                    onWhisper={() => router.push(`/room/${params.roomId}/salon/${params.salonId}/topic/new`)}
                />
            )}
            <div className="salon-page__wrapper">
                <GlossList
                    glosses={glossData}
                    scope="salon"
                    user={glossUsers}
                    room={{
                        iconUrl: roomData.roomIconUrl,
                        subIcon: undefined,
                    }}
                    onFond={handleFond}
                    fond={{
                        isPressed
                    }}
                    onSelect={(glossId, reason) => {handleReport(glossId, reason)}}
                    onGlossClick={(glossId) => {
                        router.push(`/room/${params.roomId}/salon/${params.salonId}/gloss/${glossId}`);
                    }}
                />
                <AddGlossButton onClick={() => router.push(`/room/${params.roomId}/salon/${params.salonId}/gloss/new`)} />
            </div>
        </div>
    )
}
