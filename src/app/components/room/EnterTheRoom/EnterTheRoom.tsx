import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon"
import { EditUserProfile } from "@/app/components/form/EditUserProfile";
import { useState } from "react";

import './EnterTheRoom.scss'

type User = {
    userName: string;
    iconUrl?: string;
    subIcon?: UserSubIcon | null;
}


type Props = {
    bannerUrl?: string;
    roomIconUrl?: string;
    roomName: string;
    roomRule: string;
    roomMemberIni: {
        iconUrl?: string;
        initialName?: string;
    }
    onEnter: (payload: User) => void;
}

export const EnterTheRoom = ({
    bannerUrl,
    roomIconUrl,
    roomName,
    roomRule,
    roomMemberIni,
    onEnter
}: Props) => {
    const [user, setUser] = useState<User>({
        userName: roomMemberIni.initialName ?? "",
        iconUrl: "",
        subIcon: null,
    })

    const handleEnter = () => {
        const payload: User = {
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
                    userName={user.userName}
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