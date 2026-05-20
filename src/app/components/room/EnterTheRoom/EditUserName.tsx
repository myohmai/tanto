"use client";
import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon"
import { EditUserProfile } from "@/app/components/form/EditUserProfile";

import './EnterTheRoom.scss'

export type User = {
    userName: string;
    iconUrl?: string ;
    subIcon?: UserSubIcon | null ;
}


type Props = {
    user: User;
    bannerUrl?: string;
    roomIconUrl?: string;
    roomName: string;
    roomRule: string;
    roomMemberIni: {
        iconUrl?: string | null | undefined;
        initialName?: string | null | undefined;
    }
    onChangeUserData: (payload: User) => void;
    onEnter: (payload: User) => void;
}

export const EditUserName = ({
    user,
    bannerUrl,
    roomIconUrl,
    roomName,
    roomMemberIni,
    onChangeUserData,
    onEnter
}: Props) => {

    const handleEnter = () => {
        if (!user.userName?.trim()) return;
        onEnter(user);
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
                    <span className="enter-the-room__information--title">Edit User Profile</span><br/>
                </div>
                <div className="enter-the-room__title">How should you appear in this Room?</div>
                <EditUserProfile
                    UserIconUrl={user.iconUrl || roomMemberIni.iconUrl}
                    subIcon={user.subIcon || null}
                    userName={user.userName! ||  roomMemberIni.initialName!}
                    roomInitialName={roomMemberIni.initialName}
                    onChangeUserIcon={(file) => {
                        onChangeUserData({
                            ...user,
                            iconUrl: URL.createObjectURL(file),
                        });
                    }}
                    onSubIcon={(subIcon) => {
                        onChangeUserData({
                            ...user,
                            subIcon: subIcon,
                        });
                    }}
                    onChangeName={(value) => {
                        onChangeUserData({
                            ...user,
                            userName: value,
                        });
                    }}
                    />
                <SubmitButton
                    label="Edit"
                    onClick={handleEnter}
                />
            </div>
        </div>
    )
}