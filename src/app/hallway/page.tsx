"use client";
import { HeadBar } from "@/app/components/bar/HeadBar";

import { RoomList } from "@/app/components/list/RoomList";

export default function Page() {
    return (
        <div className="feed">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <RoomList
                rooms={[]}
                scope="feed"
            />
        </div>
    )
}