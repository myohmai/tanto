"use client";
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
import { DeleteButton } from "@/app/components/buttons/DeleteButton";
import { RoomData } from "@/app/types/room";
import { useTranslations } from "next-intl";

import { useState, useRef } from "react";

import './RoomSetting.scss'

type Props = {
    roomData: RoomData;
    onChangeRoomData: (payload: RoomData) => void;
    onSubmitRoomSetting: (payload: RoomData) => void;
    onDeleteRoom: () => void;
    isPremium: boolean;
}

export const RoomSetting = ({
    roomData,
    onChangeRoomData,
    onSubmitRoomSetting,
    onDeleteRoom,
    isPremium
}: Props) => {
    const t = useTranslations('room');
    const tCommon = useTranslations('common');
    const tCert = useTranslations('certification');

    const INFO_MAX_LENGTH = 280;
    const RULE_MAX_LENGTH = 1000;

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
            public: t('visibility.public'),
            private: t('visibility.private'),
        };

    const entryLabel = {
            keyword: t('keyword'),
            quiz: t('quiz'),
        };
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleRoomSet = () => {
        setIsSubmitted(true);

        if (isSubmitDisabled) return
        const payload: RoomData = {
            ...roomData,
            roomHost: roomData.roomHost
                ? {
                    userId: roomData.roomHost.userId,
                    iconUrl:
                    roomData.roomHost.iconUrl ??
                    roomData.roomMemberIni.iconUrl,
                    userName:
                    roomData.roomHost.userName ??
                    roomData.roomMemberIni.initialName,
                    subIcon: roomData.roomHost.subIcon ?? null,
                }
                : undefined,
            };
        onSubmitRoomSetting(payload);
}

    const isRoomNameOver = roomData.roomName?.length > 30;
    const isRoomNameEmpty = roomData.roomName.trim() === "";
    const isRoomInfoEmpty = roomData.roomInformation.trim() === "";
    const isRoomMemberIniOver =
    (roomData.roomMemberIni.initialName ?? "").length > 30;
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
            <EditRoomBannerPicture onChangeBanner={(file) =>{onChangeRoomData({...roomData, roomBannerUrl: URL.createObjectURL(file)});}} />
            <div className="room-setting__wrapper stack-lg">
                <div className="room-setting__room-icon-wrapper">
                    <RoomCustomIcon roomIconUrl={roomData.roomIconUrl} className="room-setting__room-icon" />
                    <EditIconButton
                        onSelectFile={
                            (file) => {
                                onChangeRoomData({
                                    ...roomData,
                                    roomIconUrl: URL.createObjectURL(file),
                                })
                            }
                        }
                    />
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">{t('roomName')}</div>
                        <input
                            type="text"
                            className="input-box__text-box"
                            placeholder={t('roomName')}
                            value={roomData.roomName}
                            maxLength={30}
                            onChange={(e) => {
                                onChangeRoomData({
                                    ...roomData,
                                    roomName: e.target.value,
                                })
                            }}
                        />
                    </div>
                    {isSubmitted && isRoomNameOver && (
                        <div className="input-box__error">{tCommon('maxChars')}</div>
                    )}
                    {isSubmitted && isRoomNameEmpty && (
                        <div className="input-box__error">{tCommon('required')}</div>
                    )}
                </div>
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">{t('info')}</div>
                        <textarea
                                name="room-information"
                                id="room-info"
                                className="input-box__text-area"
                                placeholder={t('info')}
                                value={roomData.roomInformation}
                                maxLength={INFO_MAX_LENGTH}
                                ref={textareaRef}
                                onChange={
                                    (e) => {
                                        onChangeRoomData({
                                            ...roomData,
                                            roomInformation: e.target.value,
                                        })
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
                        <div className="input-box__error">{tCommon('required')}</div>
                    )}
                </div>
                <TagInputBox
                    onChange={
                        (tags) => {
                            onChangeRoomData({
                                ...roomData,
                                tags: tags,
                            })
                        }
                    }
                />
                <div className="room-setting__initial">
                    <div className="input-box__label">{t('memberInitialIcon')}</div>
                    <div className="room-setting__initial-icon-wrapper">
                        <UserCustomIcon iconUrl={roomData.roomMemberIni.iconUrl} />
                        <EditIconButton
                            onSelectFile={
                                (file) => {
                                    onChangeRoomData({
                                        ...roomData,
                                        roomMemberIni: {
                                            ...roomData.roomMemberIni,
                                            iconUrl: URL.createObjectURL(file),
                                        },
                                    })
                                }
                            }
                        />
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">{t('memberInitialName')}</div>
                            <input
                                type="text"
                                className="input-box__text-box"
                                placeholder="UserName"
                                value={roomData.roomMemberIni.initialName ?? ""}
                                maxLength={30}
                                onChange={(e) => {
                                    onChangeRoomData({
                                        ...roomData,
                                        roomMemberIni: {
                                            ...roomData.roomMemberIni,
                                            initialName: e.target.value,
                                        }
                                    })
                                }}
                            />
                            {isSubmitted && isRoomMemberIniOver && (
                                <div className="input-box__error">{tCommon('maxChars')}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="room-setting__host">
                    <div className="input-box__label">{t('hostInitialIcon')}</div>
                    <div className="room-setting__initial-icon-wrapper">
                        <UserCustomIcon iconUrl={roomData.roomHost?.iconUrl || roomData.roomMemberIni.iconUrl} subIcon={roomData.roomHost?.subIcon} />
                        <EditIconButton
                            onSelectFile={
                                (file) => {
                                    onChangeRoomData({
                                        ...roomData,
                                        roomHost: {
                                            userId: roomData.roomHost?.userId ?? "",
                                            iconUrl: URL.createObjectURL(file),
                                            userName: roomData.roomHost?.userName ?? "",
                                            subIcon: roomData.roomHost?.subIcon ?? null,
                                        }
                                    })
                                }
                            }
                        />
                        <EditSubIconButton onClick={() => setIsSubIconOpen(true)}/>
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">{t('hostInitialName')}</div>
                            <input
                                type="text"
                                className="input-box__text-box"
                                placeholder={roomData.roomMemberIni.initialName || "UserName"}
                                value={roomData.roomHost?.userName}
                                maxLength={30}
                                onChange={(e) => {
                                    onChangeRoomData({
                                        ...roomData,
                                        roomHost: {
                                            userId: roomData.roomHost?.userId ?? "",
                                            iconUrl: roomData.roomHost?.iconUrl ?? null,
                                            userName: e.target.value,
                                            subIcon: roomData.roomHost?.subIcon ?? null,
                                        }
                                    })
                                }}
                            />
                            {isSubmitted && isRoomHostOver && (
                                <div className="input-box__error">{tCommon('maxChars')}</div>
                            )}
                        </div>
                        <ChooseSubIcon
                            onSubmit={(subIcon) => {
                                onChangeRoomData({
                                    ...roomData,
                                    roomHost: {
                                        userId: roomData.roomHost?.userId ?? "",
                                        iconUrl: roomData.roomHost?.iconUrl ?? null,
                                        userName: roomData.roomHost?.userName ?? "",
                                        subIcon: subIcon,
                                    }
                                })
                                setIsSubIconOpen(false);
                            }}
                            isOpen={isSubIconOpen}
                            onClose={() => setIsSubIconOpen(false)}
                        />
                    </div>
                    <div className="input-box">
                        <div className="input-box__container">
                            <div className="input-box__label">{t('rules')}</div>
                            <textarea
                                    name="room-rules"
                                    id="room-rules"
                                    className="input-box__text-area"
                                    placeholder={t('rules')}
                                    value={roomData.roomRule}
                                    maxLength={RULE_MAX_LENGTH}
                                    ref={roomRuleRef}
                                    onChange={
                                        (e) => {
                                            onChangeRoomData({
                                                ...roomData,
                                                roomRule: e.target.value,
                                            })
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
                    <div className="input-box__label">{t('visibilitySettings')}</div>
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
                                            onChangeRoomData({
                                                ...roomData,
                                                roomVisibility: "public",
                                            })
                                            setIsVisibilityOpen(false);
                                        }
                                    }
                                    >{t('visibility.public')}</button>
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"private"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            if (!isPremium) return;
                                            onChangeRoomData({
                                                ...roomData,
                                                roomVisibility: "private",
                                            })
                                            setIsVisibilityOpen(false);
                                        }
                                    }
                                    disabled={!isPremium}
                                    >{t('visibility.private')}
                                    {!isPremium && (
                                        <span className="not-premium text-color-secondary">{tCommon('comingSoon')}</span>
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
                    <div className="input-box__label">{t('entrySettings')}</div>
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
                                            onChangeRoomData({
                                                ...roomData,
                                                roomEntrySetting: "keyword",
                                            })
                                            setIsEntryOpen(false);
                                        }
                                    }
                                    >{t('keyword')}</button>
                                <button
                                    type="button"
                                    className="room-setting__pulldown-button"
                                    value={"quiz"}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            onChangeRoomData({
                                                ...roomData,
                                                roomEntrySetting: "quiz",
                                            })
                                            setIsEntryOpen(false);
                                        }
                                    }
                                    >{t('quiz')}
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
                                    <div className="input-box__label">{t('entryKeyword')}</div>
                                    <input
                                        type="text"
                                        className="input-box__text-box"
                                        placeholder={t('entryKeyword')}
                                        value={roomData.roomKeyWord}
                                        maxLength={30}
                                        onChange={(e) => {
                                            onChangeRoomData({
                                                ...roomData,
                                                roomKeyWord: e.target.value,
                                            })
                                        }}
                                        />
                                </div>
                                {isSubmitted && isKeyWordEmpty && (
                                    <div className="input-box__error">{tCommon('required')}</div>
                                )}
                            </div>
                        </div>
                        <div className="room-setting__keyword">
                            <div className="input-box">
                                <div className="input-box__container">
                                    <div className="input-box__label">{t('keywordHint')}</div>
                                    <input
                                        type="text"
                                        className="input-box__text-box"
                                        placeholder="HINT"
                                        value={roomData.roomKeyWordHint}
                                        maxLength={30}
                                        onChange={(e) => {
                                            onChangeRoomData({
                                                ...roomData,
                                                roomKeyWordHint: e.target.value,
                                            })
                                        }}
                                        />
                                </div>
                                {isSubmitted && isKeyWordHinEmpty && (
                                    <div className="input-box__error">{tCommon('required')}</div>
                                )}
                            </div>
                        </div>
                    </>
                ):(
                    <div className="room-setting__quiz">
                        <SetQuizes 
                            quizes={roomData.roomQuiz}
                            onQuizes={(quizlist) => {
                                onChangeRoomData({
                                    ...roomData,
                                    roomQuiz: quizlist,
                                })
                            }}
                            isSubmitted={isSubmitted}
                        />
                        <div className="input-box">
                            <div className="input-box__container">
                                <div className="input-box__label">{tCert('passingThreshold')}</div>
                                <input
                                    type="number"
                                    className="input-box__text-box"
                                    placeholder="Enter Number"
                                    value={roomData.roomQuizScore || ""}
                                    max={99}
                                    onChange={(e) => {
                                        onChangeRoomData({
                                            ...roomData,
                                            roomQuizScore: Number(e.target.value),
                                        })
                                    }}
                                    />
                            </div>
                            <div className="room-setting__quiz-score-range text-color-secondary">
                                {t('recommendedRange')}: {recommendedRange[roomData.roomQuiz?.length || 1]}
                            </div>
                            {isSubmitted && isScoreEmpty && (
                                <div className="input-box__error">{tCommon('required')}</div>
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
                        onChangeRoomData({
                            ...roomData,
                            hostCreateSalon: !roomData.hostCreateSalon,
                        });
                    }}
                ><CheckBoxIcon variant={roomData.hostCreateSalon ? "active" : "inactive" } className="room-setting__salon-icon"/></button>
                {t('hostCreateSalons')}
            </div>
            <SubmitButton
                label={t('changeSettings')}
                onClick={handleRoomSet}
            />
            <DeleteButton label={t('deleteRoom')} onClick={onDeleteRoom} />
            </div>
        </div>
    )
}