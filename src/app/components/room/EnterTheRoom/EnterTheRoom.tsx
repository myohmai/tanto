"use client";
import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { EditUserProfile } from "@/app/components/form/EditUserProfile";

import { UserRoomData } from "@/app/types/userRoomData";

import { useState } from "react";

import './EnterTheRoom.scss'


type Props = {
    userId: string;
    bannerUrl?: string | null;
    roomId: string;
    roomIconUrl?: string | null;
    roomName: string;
    roomRule: string;
    roomMemberIni: {
        iconUrl?: string | null;
        initialName?: string | null;
    }
    onEnter: (payload: UserRoomData) => void;
}

export const EnterTheRoom = ({
    userId,
    bannerUrl,
    roomId,
    roomIconUrl,
    roomName,
    roomRule,
    roomMemberIni,
    onEnter
}: Props) => {
    const [user, setUser] = useState<UserRoomData>({
        userId,
        roomId,
        roomName,
        userName: roomMemberIni.initialName ?? "",
        iconUrl: "",
        subIcon: null,
    })

    const handleEnter = () => {
        const payload: UserRoomData = {
            ...user,
        }
        onEnter(payload);
    }
    return(
        <div className="enter-the-room bg-color-primary text-color-primary">
            <div className="enter-the-room__banner">
                <img src={bannerUrl || '/images/default.png'} alt="Room Banner" className="enter-the-room__banner--image"/>
            </div>
            <div className="enter-the-room__wrapper stack-lg">
                <RoomCustomIcon roomIconUrl={roomIconUrl} className="enter-the-room__icon" />
                <div className="enter-the-room__room-name">{roomName}</div>
                <div className="enter-the-room__information">
                    <span className="enter-the-room__information--title">Welcome!</span><br/>
                    Please follow the Room Rules and enjoy.
                </div>
                <div className="enter-the-room__rule">
                    {roomRule}
                </div>
                <div className="enter-the-room__title">How should you appear in this Room?</div>
                <EditUserProfile
                    UserIconUrl={user.iconUrl || roomMemberIni.iconUrl}
                    subIcon={user.subIcon || null}
                    userName={user.userName ?? undefined}
                    roomInitialName={roomMemberIni.initialName}
                    onChangeUserIcon={(file) => {
                        setUser((prev) => ({
                            ...prev,
                            iconUrl: URL.createObjectURL(file),
                        }));
                    }}
                    onSubIcon={(subIcon) => {
                        setUser((prev) => ({
                            ...prev,
                            subIcon: subIcon,
                        }));
                    }}
                    onChangeName={(value) => {
                        setUser((prev) => ({
                            ...prev,
                            userName: value,
                        }))
                    }}
                    />
                <SubmitButton
                    label="Enter"
                    onClick={handleEnter}
                />
            </div>
        </div>
    )
}