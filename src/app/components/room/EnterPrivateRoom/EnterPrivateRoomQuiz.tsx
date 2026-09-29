import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { QuizContainer } from "@/app/components/form/QuizContainer";
import type { PrivateRoomQuizQuestion } from "@/repositories/privateRoom";
import { useState } from "react";

import './EnterPrivateRoom.scss'


type Props = {
    bannerUrl?: string | null;
    roomIconUrl?: string | null;
    roomName: string ;
    roomQuiz?: PrivateRoomQuizQuestion[] | null;
    // 選んだ選択肢の id を渡して判定する(判定は DB 側)。通れば true
    onSubmit: (answers: string[]) => Promise<boolean>;
}

export const EnterPrivateRoomQuiz = ({
    bannerUrl,
    roomIconUrl,
    roomName,
    roomQuiz,
    onSubmit
}: Props) => {
    const [answers, setAnswers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [isShowToast, setIsShowToast] = useState(false);

    const isDisabled = errorCount >= 3;

    const handleEnter = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // 合計点が作成画面の「合格ライン」(room_quiz_score)以上なら合格。採点は DB 側
    const ok = await onSubmit(answers).catch(() => false);
    setIsSubmitting(false);
    if (ok) return;

    setErrorCount((prev) => prev + 1);
    setIsShowToast(true);

    setTimeout(() => {
        setIsShowToast(false);
    }, 2000);
}

    return(
        <div className="enter-private-room bg-color-primary text-color-primary">
            <div className="enter-private-room__banner">
                <img src={bannerUrl || '/images/202600620.png'} alt="Room Banner" className="enter-private-room__banner--image"/>
            </div>
            <div className="enter-private-room__wrapper stack-lg">
                <RoomCustomIcon roomIconUrl={roomIconUrl} className="enter-private-room__icon" />
                <div className="enter-private-room__room-name">{roomName}</div>
                <div className="enter-private-room__information">
                    This Room is Private.<br />
                    Please Enter a Keyword.
                </div>
                <QuizContainer onAnswers={setAnswers} questions={roomQuiz ?? []}/>
                <SubmitButton
                    label="Enter"
                    onClick={handleEnter}
                    disabled={isDisabled || isSubmitting}
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