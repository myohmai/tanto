"use client";
import { HeadBar } from "@/app/components/bar/HeadBar";

import { MoodList } from "@/app/components/list/MoodList";

export default function Page() {
    return (
        <div className="feed">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <MoodList
                turntables={[]}
            />
        </div>
    )
}