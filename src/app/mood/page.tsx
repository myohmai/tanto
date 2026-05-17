"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { MoodList } from "@/app/components/list/MoodList";

import { getTurntables } from "@/repositories/turntable";

import { type TurnTableData } from "@/app/types";

export default function Page() {
    const router = useRouter();
    const params = useParams<{ roomId: string }>();

    const [turntableData, setTurntableData] =
            useState<TurnTableData[]>([]);

    useEffect(() => {
        getTurntables().then((turntables) => {
            setTurntableData(turntables);
        });
    },[]);
    return (
        <div className="feed">
            <div className="fedd__sticky">
                <HeadBar
                    onReload={() => {}}
                    onSearch={() => {}}
                    onSideMenu={() => {}}
                />
            </div>
            <MoodList
                turntables={turntableData}
            />
        </div>
    )
}