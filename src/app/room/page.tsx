"use client";
import { useState } from "react";

import { RoomInfo } from "@/app/components/content/RoomInfo";
import { RoomTopBar } from "@/app/components/bar/RoomTopBar";
import { RoomTabBar, TabType } from "@/app/components/bar/RoomTabBar";

import { GlossList } from "@/app/components/list/GlossList";
import { SalonList } from "@/app/components/list/SalonList";

import { TurnTableMusicList } from "@/app/components/list/TurnTableMusicList";
import { TurnTableVideoList } from "@/app/components/list/TurnTableVideoList/TurnTableVideoList";

import { TurnTableMediaTab, TurnTableMediaType } from "@/app/components/bar/TurnTableMediaTab";

import { CreateSalonButton } from "@/app/components/buttons/CreateSalonButton";
import { AddTurnTableButton } from "@/app/components/buttons/AddTurnTableButton";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState<TabType>("Gloss");
    const [selectMediaTab, setSelectMediaTab] =
        useState<TurnTableMediaType>("Music");

    return (
        <div className="room-top">

            <RoomInfo
                roomData={{}}
                subIcon={undefined}
                onSearch={() => {}}
                onEdit={() => {}}
                onEnter={() => {}}
                onShare={() => {}}
                onMute={() => {}}
                onSelect={() => {}}
                isEntered={false}
            />

            <RoomTopBar
                roomName="Room"
                onBack={() => {}}
                onEnter={() => {}}
                isEntered={false}
                onRoom={() => {}}
            />

            <RoomTabBar
                selectedTab={selectedTab}
                onChange={(value) => setSelectedTab(value)}
            />

            {/* Gloss */}
            {selectedTab === "Gloss" && (
                <GlossList
                    glosses={[]}
                    scope="room"
                />
            )}

            {/* Salon */}
            {selectedTab === "Salon" && (
                <div className="room-top__salon">
                    <SalonList salons={[]} />
                    <CreateSalonButton onClick={() => {}} />
                </div>
            )}

            {/* TurnTable */}
            {selectedTab === "Turn Table" && (
                <div className="room-top__turn-table">

                    <TurnTableMediaTab
                        selectedTab={selectMediaTab}
                        onChange={(value) => setSelectMediaTab(value)}
                    />

                    {selectMediaTab === "Music" && (
                        <TurnTableMusicList
                            turntables={[]}
                        />
                    )}

                    {selectMediaTab === "Video" && (
                        <TurnTableVideoList
                            turntables={[]}
                        />
                    )}

                    <AddTurnTableButton onClick={() => {}} />
                </div>
            )}

        </div>
    );
}