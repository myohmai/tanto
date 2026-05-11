import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { EntryKeyword } from "@/app/components/form/EntryKeyword";
import { useState } from "react";

import './EnterPrivateRoom.scss'


type Props = {
    bannerUrl?: string;
    roomIconUrl?: string;
    roomName: string;
    roomKeyWord?: string;
    roomKeyWordHint?: string;
    onEnter: () => void;
}

export const EnterPrivateRoomKeyword = ({
    bannerUrl,
    roomIconUrl,
    roomName,
    roomKeyWord,
    roomKeyWordHint,
    onEnter
}: Props) => {
    const [keyword, setKeyword] = useState("");
    const [errorCount, setErrorCount] = useState(0);
    const [isShowToast, setIsShowToast] = useState(false);

    const isDisabled = errorCount >= 3;

    const handleEnter = () => {
    if (keyword === roomKeyWord) {
        onEnter();
        return;
    }

    setErrorCount((prev) => prev + 1);
    setIsShowToast(true);

    setTimeout(() => {
        setIsShowToast(false);
    }, 2000);
}

    return(
        <div className="enter-private-room bg-color-primary text-color-primary">
            <div className="enter-private-room__banner">
                <img src={bannerUrl || '/images/default.png'} alt="Room Banner" className="enter-private-room__banner--image"/>
            </div>
            <div className="enter-private-room__wrapper stack-lg">
                <RoomCustomIcon roomIconUrl={roomIconUrl} className="enter-private-room__icon" />
                <div className="enter-private-room__room-name">{roomName}</div>
                <div className="enter-private-room__information">
                    This Room is Private.<br />
                    Please Enter a Keyword.
                </div>
                <EntryKeyword
                    keywordHint={roomKeyWordHint} 
                    onChange={(value) => setKeyword(value)}
                />
                <SubmitButton
                    label="Enter"
                    onClick={handleEnter}
                    disabled={isDisabled}
                />
                {isShowToast && (
                    <div className="toast">
                        Incorrect keyword
                    </div>
                )}
            </div>
        </div>
    )
}