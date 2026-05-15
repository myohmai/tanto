"use client";
import { SalonTopBar } from "@/app/components/bar/SalonTopBar";

import { GlossList } from "@/app/components/list/GlossList";

import { AddGlossButton } from "@/app/components/buttons/AddGlossButton";

import { TopicBoxBar } from "@/app/components/bar/TopicBoxBar";

import { SalonData } from "@/app/types/salon";

export default function Page() {
    return (
        <div className="salon-page">
            <SalonTopBar
                roomName=""
                salonName=""
                onBack={()=>{}}
                onRoom={() => {}}
                onSalon={() => {}}
                onPin={() => {}}
                onEdit={() => {}}
                onMute={() => {}}
                isHost={false}
            />
            {isTopicBox && (
                <TopicBoxBar
                    isHost={isHost}
                    onView={() => {}}
                    onWhisper={() => {}}
                />
            )}
            <div className="salon-page__wrapper">
                <GlossList
                    glosses={[]}
                    scope="salon"
                />
                <AddGlossButton onClick={() => {}} />
            </div>
        </div>
    )
}