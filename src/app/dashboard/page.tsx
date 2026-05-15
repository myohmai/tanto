"use client";
import { HeadBar } from "@/app/components/bar/HeadBar";

import { DashBoardTabBar, DashBoardTabType } from "@/app/components/bar/DashBoardTabBar";

import { DashboardUserNameBar } from "@/app/components/bar/DashboardUserNameBar";

import { RoomList } from "@/app/components/list/RoomList";
import { GlossList } from "@/app/components/list/GlossList";

import { useState } from "react";
import { Value } from "sass";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState<DashBoardTabType>('My Gloss');

    return(
        <div className="dashboard">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <DashboardUserNameBar
                list={[]}
                currentRoom={}
                onChange={() => {}}
            />
            <DashBoardTabBar
                selectedTab={selectedTab}
                onChange={(value) => setSelectedTab(value)}
            />
            {selectedTab === 'Joined Room' && (
                <RoomList
                    rooms={[]}
                    scope="dashboard"
                />
            )}
            {selectedTab === 'Owned Room' && (
                <RoomList
                    rooms={[]}
                    scope="dashboard"
                />
            )}
            {selectedTab === 'My Gloss' && (
                <GlossList
                    glosses={[]}
                    scope="feed"
                />
            )}
        </div>
    )
}