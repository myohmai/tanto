"use client";
import { HeadBar } from "@/app/components/bar/HeadBar";

import { GlossList } from "@/app/components/list/GlossList";

export default function Page() {
    return (
        <div className="feed">
            <HeadBar
                onReload={() => {}}
                onSearch={() => {}}
                onSideMenu={() => {}}
            />
            <GlossList
                    glosses={[]}
                    scope="feed"
            />
        </div>
    )
}