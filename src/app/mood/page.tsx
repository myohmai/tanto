"use client";
import './page.scss';
import { useEffect, useState } from "react";
import { useSideMenu } from "@/app/context/SideMenuContext";

import { HeadBar } from "@/app/components/bar/HeadBar";

import { MoodList } from "@/app/components/list/MoodList";

import { getTurntables } from "@/repositories/turntable";

import { type TurnTableData } from "@/app/types";

export default function Page() {
    const { openSideMenu } = useSideMenu();

    const [turntableData, setTurntableData] =
            useState<TurnTableData[]>([]);

    useEffect(() => {
        getTurntables().then((turntables) => {
            setTurntableData(turntables);
        });
    },[]);
    return (
        <div className="mood">
            <div className="mood__sticky">
                <HeadBar
                    onReload={() => {}}
                    onSearch={() => {}}
                    onSideMenu={openSideMenu}
                />
            </div>
            <MoodList
                turntables={turntableData}
            />
        </div>
    )
}