import { EditRoomBannerPicture } from "@/app/components/form/EditRoomBannerPicture";
import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { EditIconButton } from "@/app/components/buttons/EditIconButton";
import { EditSubIconButton } from "@/app/components/buttons/EditSubIconButton";
import { UserCustomIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { TagInputBox } from "@/app/components/form/TagInputBox";
import { SetQuizes } from "@/app/components/form/SetQuizes";
import { CheckBoxIcon } from "@/app/components/icons";
import { SubmitButton } from "@/app/components/buttons/SubmitButton";
import { ChooseSubIcon } from "@/app/components/menu/ChooseSubIcon";
import { PulldownArrow } from "@/app/components/buttons/PulldownArrow";
import { RoomData } from "@/app/types/room";

import { nanoid } from 'nanoid';


import { useState, useRef } from "react";

import './RoomSetting.scss'


type Props = {
    onCreateRoom: (payload: RoomData) => void;
    isPremium: boolean;
}

export const CreateRoom = ({
    onCreateRoom,
    isPremium
}: Props) => {
    const roomId = nanoid();
    const currentUserId = "auth-user-id"; // 仮
    const INFO_MAX_LENGTH = 280;
    const RULE_MAX_LENGTH = 1000;
    const [roomData, setRoomData] = useState<RoomData>({
        roomId: roomId,
        roomBannerUrl: null,
        roomIconUrl: null,
        roomName: "",

        roomInformation: "",
        tags: [],

        roomRule: "",

        roomMemberIni: {
            iconUrl: null,
            initialName: "",
        },

        roomMemberCount: 0,

        roomVisibility: "public",

        roomEntrySetting: undefined,

        roomKeyWord: "",
        roomKeyWordHint: "",

        roomQuiz: null,
        roomQuizScore: 0,

        roomHost: {
            userId: currentUserId,
            iconUrl: null,
            userName: "",
            subIcon: null,
        },

        hostCreateSalon: false,
        reports: [],
        glossCount: 0,
        recentGlossCount: 0,
    })
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isSubIconOpen, setIsSubIconOpen] = useState(false);
    const roomRuleRef = useRef<HTMLTextAreaElement | null>(null);
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
    const [isEntryOpen, setIsEntryOpen] = useState(false);
    const recommendedRange: Record<number, string> = {
            1: "2–3 points",
            2: "4–6 points",
            3: "6–9 points",
            4: "8–12 points",
            5: "10–15 points",
        };

    const visibilityLabel = {
            public: "Public",
            private: "Private",
        };

        const entryLabel = {
            keyword: "Keyword",
            quiz: "Quiz",
        };
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleRoomSet = () => {
        setIsSubmitted(true);

        if (isSubmitDisabled) return
        const payload: RoomData = {
            ...roomData,
            roomHost: {
                userId: currentUserId,
                iconUrl:
                    roomData.roomHost?.iconUrl ||
                    roomData.roomMemberIni.iconUrl,
                userName:
                    roomData.roomHost?.userName ||
                    roomData.roomMemberIni.initialName,
            },
        }
        onCreateRoom(payload);
}

    const isRoomNameOver = roomData.roomName.length > 30;
    const isRoomNameEmpty = roomData.roomName.trim() === "";
    const isRoomInfoEmpty = roomData.roomInformation.trim() === "";
    const isRoomMemberIniOver = roomData.roomMemberIni.initialName.length > 30;
    const isRoomHostOver = (roomData.roomHost?.userName ?? "").length > 30;
    const isKeyWordEmpty = roomData.roomKeyWord?.trim() === "";
    const isKeyWordHinEmpty = roomData.roomKeyWordHint?.trim() === "";
    const isScoreEmpty = !roomData.roomQuizScore || roomData.roomQuizScore <= 0;


    const isKeywordInvalid =
    roomData.roomVisibility === "private" &&
    roomData.roomEntrySetting === "keyword" &&
    (isKeyWordEmpty || isKeyWordHinEmpty);

    const isQuizInvalid =
        roomData.roomVisibility === "private" &&
        roomData.roomEntrySetting === "quiz" &&
        (
            !roomData.roomQuiz ||
            roomData.roomQuiz.length === 0 ||
            isScoreEmpty
        );

    const isSubmitDisabled =
        isRoomNameEmpty ||
        isRoomInfoEmpty ||
        isKeywordInvalid ||
        isQuizInvalid;
    return(
        <div className="room-setting bg-color-primary text-color-primary">
            <EditRoomBannerPicture onChangeBanner={(file) =>{setRoomData((prev) => ({...prev, roomBannerUrl: URL.createObjectURL(file)}));}} />
            <div className="room-setting__wrapper stack-lg">
                <div className="room-setting__room-icon-wrapper">
                    <RoomCustomIcon roomIconUrl={roomData.roomIconUrl} className="room-setting__room-icon" />
                    <EditIconButton
                        onSelectFile={
                            (file) => {
                                setRoomData((prev) => ({
                                    ...prev,
                                    roomIconUrl: URL.createObjectURL(file)
                                }));
                            }
                        }
                    />
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">Roomname</div>
                        <input
                            type="text"
                            className="input-box__text-box"
                            placeholder="RoomName"
                            value={roomData.roomName}
                            maxLength={30}
                            onChange={(e) => {
                                setRoomData((prev) => ({
                                    ...prev,
                                    roomName: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    {isSubmitted && isRoomNameOver && (
                        <div className="input-box__error">
                            Please enter within 30 characters
                        </div>
                    )}
                    {isSubmitted && isRoomNameEmpty && (
                        <div className="input-box__error">
                            This field is required
                        </div>
                    )}
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">
                            Room information
                        </div>
                        <textarea
                                name="room-information" 
                                id="room-info"
                                className="input-box__text-area"
                                placeholder="Room information"
                                value={roomData.roomInformation}
                                maxLength={INFO_MAX_LENGTH}
                                ref={textareaRef}
                                onChange={
                                    (e) => {
                                        setRoomData((prev) => ({
                                            ...prev,
                                            roomInformation: e.target.value,
                                        }));
                                        const el = textareaRef.current;
                                        if (!el) return;

                                        el.style.height = "auto";
                                        el.style.height = el.scrollHeight + "px";
                                    }
                                }
                        />
                        <div className="room-setting__info-count text-color-primary">
                            {roomData.roomInformation.length} / {INFO_MAX_LENGTH}
                        </div>
                    </div>
                    {isSubmitted && isRoomInfoEmpty && (
                        <div className="input-box__error">
                            This field is required
                        </div>
                    )}
                </div>
                <TagInputBox
                    onChange={
                        (tags) => {
                            setRoomData((prev) => ({
                                ...prev,
                                tags: tags,
                            }));
                        }
                    }
                />
                <div className="room-setting__initial">
                    <div className="input-box__label">Room Member's Initial Icon</div>
                    <div className="room-setting__initial-icon-wrapper">
                        <UserCustomIcon iconUrl={roomData.roomMemberIni.iconUrl} />
                        <EditIconButton
                            onSelectFile={
                                (file) => {
                                    setRoomData((prev) => ({
                                        ...prev,
                                        roomMemberIni: {
                                            ...prev.roomMemberIni,
                                            iconUrl: URL.createObjectURL(file),
                                        },
                                    }));
                                }
                            }
                        />
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">Room Member’s Initial name</div>
                            <input
                                type="text"
                                className="input-box__text-box"
                                placeholder="UserName"
                                value={roomData.roomMemberIni.initialName}
                                maxLength={30}
                                onChange={(e) => {
                                    setRoomData((prev) => ({
                                        ...prev,
                                        roomMemberIni: {
                                            ...prev.roomMemberIni,
                                            initialName: e.target.value,
                                        }
                                    }));
                                }}
                            />
                            {isSubmitted && isRoomMemberIniOver && (
                                <div className="input-box__error">
                                    Please enter within 30 characters
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="room-setting__host">
                    <div className="input-box__label">Room Host's Initial Icon</div>
                    <div className="room-setting__initial-icon-wrapper">
                        <UserCustomIcon iconUrl={roomData.roomHost?.iconUrl || roomData.roomMemberIni.iconUrl} subIcon={roomData.roomHost?.subIcon} />
                        <EditIconButton
                            onSelectFile={
                                (file) => {
                                    setRoomData((prev) => ({
                                            ...prev,
                                            roomHost: {
                                                userId: prev.roomHost?.userId ?? currentUserId,
                                                iconUrl: URL.createObjectURL(file),
                                                userName: prev.roomHost?.userName ?? "",
                                                subIcon: prev.roomHost?.subIcon ?? null,
                                        }
                                    }));
                                }
                            }
                        />
                        <EditSubIconButton onClick={() => setIsSubIconOpen(true)}/>
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">Room Host's Initial name</div>
                            <input
                                type="text"
                                className="input-box__text-box"
                                placeholder={roomData.roomMemberIni.initialName || "UserName"}
                                value={roomData.roomHost?.userName}
                                maxLength={30}
                                onChange={(e) => {
                                    setRoomData((prev) => ({
                                    ...prev,
                                    roomHost: {
                                        userId: prev.roomHost?.userId ?? currentUserId,
                                        iconUrl: prev.roomHost?.iconUrl ?? null,
                                        userName: e.target.value,
                                        subIcon: prev.roomHost?.subIcon ?? null,
                                    }
                                    }));
                                }}
                            />
                            {isSubmitted && isRoomHostOver && (
                                <div className="input-box__error">
                                    Please enter within 30 characters
                                </div>
                            )}
                        </div>
                        <ChooseSubIcon
                            onSubmit={(subIcon) => {
                                setRoomData((prev) => ({
                                    ...prev,
                                    roomHost: {
                                        userId: prev.roomHost?.userId ?? currentUserId,
                                        iconUrl: prev.roomHost?.iconUrl ?? null,
                                        userName: prev.roomHost?.userName ?? "",
                                        subIcon: subIcon,
                                    }
                                }));
                                setIsSubIconOpen(false);
                            }}
                            isOpen={isSubIconOpen}
                            onClose={() => setIsSubIconOpen(false)}
                        />
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">
                                Room Rules
                            </div>
                            <textarea
                                    name="room-rules" 
                                    id="room-rules"
                                    className="input-box__text-area"
                                    placeholder="Room Rules"
                                    value={roomData.roomRule}
                                    maxLength={RULE_MAX_LENGTH}
                                    ref={roomRuleRef}
                                    onChange={
                                        (e) => {
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomRule: e.target.value,
                                            }));
                                            const el = roomRuleRef.current;
                                            if (!el) return;

                                            el.style.height = "auto";
                                            el.style.height = el.scrollHeight + "px";
                                        }
                                    }
                            />
                            <div className="room-setting__info-count text-color-primary">
                                {roomData.roomRule.length} / {RULE_MAX_LENGTH}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="room-setting__visibility">
                    <div className="input-box__label">Visibility settings</div>
                    <div 
                        className="room-setting__pulldown bg-color-secondary padding-sm-md"
                        onClick={() => {
                            setIsVisibilityOpen((prev) => !prev);
                        }}
                    >
                        {isVisibilityOpen ?
                            <div className="room-setting__pulldown-wrapper">
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"public"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomVisibility: "public",
                                            }));
                                            setIsVisibilityOpen(false);
                                        }
                                    }
                                    >Public</button>
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"private"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            if (!isPremium) return;
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomVisibility: "private",
                                            }));
                                            setIsVisibilityOpen(false);
                                        }
                                    }
                                    disabled={!isPremium}
                                    >Private
                                    {!isPremium && (
                                        <span className="not-premium text-color-secondary">Coming Soon</span>
                                    )}
                                    </button>
                            </div>
                            :
                            <div className="room-setting__selected">{visibilityLabel[roomData.roomVisibility]}</div>
                        }
                        <PulldownArrow isOpen={isVisibilityOpen}/>
                    </div>
                </div>
                {roomData.roomVisibility === "private" && (
                <div className="room-setting__entry-way">
                    <div className="input-box__label">Entry settings</div>
                    <div
                        className="room-setting__pulldown bg-color-secondary padding-sm-md"
                        onClick={() => {
                            setIsEntryOpen((prev) => !prev);
                        }}
                    >
                        {isEntryOpen ?
                            <div className="room-setting__pulldown-wrapper">
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"keyword"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomEntrySetting: "keyword",
                                            }));
                                            setIsEntryOpen(false);
                                        }
                                    }
                                    >Keyword</button>
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"quiz"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomEntrySetting: "quiz",
                                            }));
                                            setIsEntryOpen(false);
                                        }
                                    }
                                    >Quiz
                                    </button>
                            </div>
                            :
                            <div className="room-setting__selected">{roomData.roomEntrySetting && entryLabel[roomData.roomEntrySetting]}</div>
                        }
                        <PulldownArrow isOpen={isEntryOpen} />
                    </div>
                    {roomData.roomEntrySetting === "keyword" ?(
                        <>
                        <div className="room-setting__keyword">
                            <div className="input-box">
                                <div className="input-box__container">
                                    <div className="input-box__label">Room Entry Keyword</div>
                                    <input
                                        type="text"
                                        className="input-box__text-box"
                                        placeholder="Room Keyword"
                                        value={roomData.roomKeyWord}
                                        maxLength={30}
                                        onChange={(e) => {
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomKeyWord: e.target.value,
                                            }));
                                        }}
                                        />
                                </div>
                                {isSubmitted && isKeyWordEmpty && (
                                    <div className="input-box__error">
                                        This field is required
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="room-setting__keyword">
                            <div className="input-box">
                                <div className="input-box__container">
                                    <div className="input-box__label">Keyword Hint</div>
                                    <input
                                        type="text"
                                        className="input-box__text-box"
                                        placeholder="HINT"
                                        value={roomData.roomKeyWordHint}
                                        maxLength={30}
                                        onChange={(e) => {
                                            setRoomData((prev) => ({
                                                ...prev,
                                                roomKeyWordHint: e.target.value,
                                            }));
                                        }}
                                        />
                                </div>
                                {isSubmitted && isKeyWordHinEmpty && (
                                    <div className="input-box__error">
                                        This field is required
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ):(
                    <div className="room-setting__quiz">
                        <SetQuizes 
                            onQuizes={(quizlist) => {
                                setRoomData((prev) => ({
                                    ...prev,
                                    roomQuiz: quizlist,
                                }));
                            }}
                            isSubmitted={isSubmitted}
                        />
                        <div className="input-box">
                            <div className="input-box__container">
                                <div className="input-box__label">Passing Threshold</div>
                                <input
                                    type="number"
                                    className="input-box__text-box"
                                    placeholder="Enter Number"
                                    value={roomData.roomQuizScore || ""}
                                    max={99}
                                    onChange={(e) => {
                                        setRoomData((prev) => ({
                                            ...prev,
                                            roomQuizScore: Number(e.target.value),
                                        }));
                                    }}
                                    />
                            </div>
                            <div className="room-setting__quiz-score-range text-color-secondary">
                                Recommended Range: {recommendedRange[roomData.roomQuiz?.length || 1]}
                            </div>
                            {isSubmitted && isScoreEmpty && (
                                <div className="input-box__error">
                                    This field is required
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            )}
            <div className="room-setting__salon">
                <button
                    type="button"
                    onClick={() => {
                        setRoomData((prev) =>({
                            ...prev,
                            hostCreateSalon: !prev.hostCreateSalon,
                        }));
                    }}
                ><CheckBoxIcon variant={roomData.hostCreateSalon ? "active" : "inactive" } className="room-setting__salon-icon"/></button>
                Only host can create salons
            </div>
            <SubmitButton
                label="Create Room"
                onClick={handleRoomSet}
            />
            </div>
        </div>
    )
}