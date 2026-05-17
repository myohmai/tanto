"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

import './page.scss'

import { RoomInfo } from "@/app/components/content/RoomInfo";
import { RoomTopBar } from "@/app/components/bar/RoomTopBar";
import { RoomTabBar, TabType } from "@/app/components/bar/RoomTabBar";

import { GlossList } from "@/app/components/list/GlossList";
import { SalonList } from "@/app/components/list/SalonList";

import { TurnTableMusicList } from "@/app/components/list/TurnTableMusicList";
import { TurnTableVideoList } from "@/app/components/list/TurnTableVideoList/TurnTableVideoList";

import {
    TurnTableMediaTab,
    TurnTableMediaType,
} from "@/app/components/bar/TurnTableMediaTab";

import { CreateSalonButton } from "@/app/components/buttons/CreateSalonButton";
import { AddTurnTableButton } from "@/app/components/buttons/AddTurnTableButton";

import { getRooms } from "@/repositories/room";
import { getTurntables } from "@/repositories/turntable";
import { getSalons } from "@/repositories/salon";
import { getGlosses, updateGlossFond } from "@/repositories/gloss";
import { getUserRoomData } from "@/repositories/userRoom";

import { GlossData, SalonData, type RoomData, type TurnTableData, type UserRoomData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string }>();
    const roomId = params.roomId;
    
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    const [turntableData, setTurntableData] =
        useState<TurnTableData[]>([]);

    const [salonData, setSalonData] = useState<SalonData[]>([]);

    const [glossData, setGlossData] = useState<GlossData[]>([]);
    const [glossUsers, setGlossUsers] = useState<UserRoomData[]>([]);


    const [showTopBar, setShowTopBar] = useState(false);
    const isMounted = true;
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [selectedTab, setSelectedTab] =
        useState<TabType>("Gloss");

    const [selectMediaTab, setSelectMediaTab] =
        useState<TurnTableMediaType>("Music");

    useEffect(() => {
        getRooms().then((rooms) => {
            const room = rooms.find((room) => room.roomId === roomId);
            setRoomData(room ?? null);
        });
    }, [roomId]);

    useEffect(() => {
        getTurntables().then((turntables) => {
            setTurntableData(turntables.filter((turntable) => turntable.roomId === roomId));
        });
    }, [roomId]);

    useEffect(() => {
        getSalons().then((salons) => {
            setSalonData(salons.filter((salon) => salon.roomId === roomId));
        });
    }, [roomId]);

    useEffect(() => {
        getGlosses().then((glosses) => {
            setGlossData(glosses.filter((gloss) => gloss.roomId === roomId));
        });
    }, [roomId]);

    const handleFond = async (glossId: string) => {
        await updateGlossFond(glossId);
        const glosses = await getGlosses();
        setGlossData(glosses.filter((gloss) => gloss.roomId === roomId));
    };

    useEffect(() => {
        getUserRoomData().then((users) => {
            setGlossUsers(users);
        });
    },[]);


    useEffect(() => {
        const target = sentinelRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log("observer", entry.isIntersecting);
                setShowTopBar(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px",
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [isMounted]);

    if (!roomData || !isMounted) return null;

    return (
        <div className="room-top">
                <RoomInfo
                    roomData={roomData}
                    subIcon={undefined}
                    onSearch={() => {}}
                    onEdit={() => {}}
                    onEnter={() => {}}
                    onShare={() => {}}
                    onMute={() => {}}
                    onSelect={() => {}}
                    isEntered={false}
                />
            <div ref={sentinelRef} style={{ height: "1px" }} />
            <div className="room-top__sticky">
                {isMounted && showTopBar && ( 
                    <RoomTopBar
                        roomName="Room"
                        onBack={() => {}}
                        onEnter={() => {}}
                        isEntered={false}
                        onRoom={() => {}}
                    />
                )}

                <RoomTabBar
                    selectedTab={selectedTab}
                    onChange={(value) => setSelectedTab(value)}
                />
            </div>

            {selectedTab === "Gloss" && (
                <div style={{ height: "2000px" }}>
                    <GlossList
                        glosses={glossData}
                        scope="room"
                        user={glossUsers}
                        room={{
                            iconUrl: roomData.roomIconUrl,
                            subIcon: undefined,
                        }}
                        onFond={handleFond}
                        onGlossClick={(glossId) => {
                            const gloss = glossData.find(g => g.glossId === glossId);
                            if (!gloss) return;

                            router.push(`/room/${roomId}/salon/${gloss.salonId}/gloss/${glossId}`);
                        }}
                    />
                    </div>
            )}

            {selectedTab === "Salon" && (
                <div className="room-top__salon">
                    <SalonList
                        salons={salonData}
                        onClick={(salon) =>
                            router.push(`/room/${roomData.roomId}/salon/${salon.salonId}`)}/>
                    <CreateSalonButton
                        onClick={() => router.push(`/room/${roomId}/salon/new`)}
                    />
                </div>
            )}

            {selectedTab === "Turn Table" && (
                <div className="room-top__turn-table">

                    <TurnTableMediaTab
                        selectedTab={selectMediaTab}
                        onChange={(value) => setSelectMediaTab(value)}
                    />

                    {selectMediaTab === "Music" && (
                        <TurnTableMusicList
                            turntables={turntableData}
                        />
                    )}

                    {selectMediaTab === "Video" && (
                        <TurnTableVideoList
                            turntables={turntableData}
                        />
                    )}

                    <AddTurnTableButton onClick={() => {}} />
                </div>
            )}
        </div>
    );
}
