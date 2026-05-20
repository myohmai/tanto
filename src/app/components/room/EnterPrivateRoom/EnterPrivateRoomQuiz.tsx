import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { QuizContainer } from "@/app/components/form/QuizContainer";
import { QuizeList } from "@/app/components/form/SetQuizes";
import { useState } from "react";

import './EnterPrivateRoom.scss'


type Props = {
    bannerUrl?: string | null;
    roomIconUrl?: string | null;
    roomName: string ;
    roomQuiz?: QuizeList[] | null;
    roomQuizScore?: number;
    onEnter: () => void;
}

export const EnterPrivateRoomQuiz = ({
    bannerUrl,
    roomIconUrl,
    roomName,
    roomQuiz,
    roomQuizScore,
    onEnter
}: Props) => {
    const [score, setScore] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isShowToast, setIsShowToast] = useState(false);

    const isDisabled = errorCount >= 3;

    const handleEnter = () => {
    if (score <= (roomQuizScore ?? 0)) {
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
                <QuizContainer onScore={setScore} questions={roomQuiz ?? []}/>
                <SubmitButton
                    label="Enter"
                    onClick={handleEnter}
                    disabled={isDisabled}
                />
                {isShowToast && (
                    <div className="toast">
                        Access denied
                    </div>
                )}
            </div>
        </div>
    )
}