import { FondIcon, BiasColor, FondLevel } from "@/app/components/icons"; 
import { UserCustomIcon, UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { RoomCustomIcon  } from "@/app/components/custom-icon/RoomCustomIcon";
import { WhereYouAre } from "@/app/components/content/WhereYouAre";
import { MenuButton } from "@/app/components/buttons/MenuButton";
import { Notification, NotificationType } from "@/app/components/evaluation/Notification";
import { Media, } from "@/app/components/media/Media";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";
import { TopicContent } from "@/app/components/content/TopicContent";
import { Revaluation } from "@/app/components/evaluation/Revaluation";
import { FondButton } from "@/app/components/buttons/FondButton";
import { ReplyButton } from "@/app/components/buttons/ReplyButton";
import { GlossMenu } from "@/app/components/menu/GlossMenu";
import { ReportMenu } from "@/app/components/menu/ReportMenu";
import { ShowGlossId } from "@/app/components/menu/ShowGlossId";

import type { GlossData } from "@/app/types/gloss";
import type { Report,ReportType } from "@/app/types/report";

import { useState, useEffect } from "react";

import './Gloss.scss'


type GlossProps = {
    glossData: GlossData;
    isInFeed: boolean;
    isInRoom: boolean;
    isInSalon: boolean;
    className?: string;
    user: {
        iconUrl: string | undefined | null;
        subIcon?: UserSubIcon | null;
    }
    room: {
        iconUrl: string | null | undefined;
        subIcon?: { type: 'fond'; value: FondLevel } | undefined;
    }
    onSeeAlso?: () => void;
    onTopicSeeAlso?: () => void;
    
    notification?: {
        type: NotificationType;
    }
    revaluation?: {
        onYes: (glossId: string) => void;
        onNo: (glossId: string) => void;
    }
    action: {
        onRoom: (gloss: GlossData) => void;
        onSalon?: (gloss: GlossData) => void;
        onFond: (glossId: string) => void;
        onReply: (gloss: GlossData) => void;
    }
    onSelect?: (reason: Report) => void;
    fond: {
        isPressed: (glossId: string) => boolean;
    }
    onBlock: () => void;
    onGlossClick?: (glossId: string) => void;
    isBlocked: boolean;
    isOwn: boolean;
    lang: 'en' | 'ja';
}

export const Gloss = ({
    glossData,
    isInFeed,
    isInRoom,
    isInSalon,
    className,
    user,
    room,
    onSeeAlso,
    onTopicSeeAlso,
    notification,
    revaluation,
    action,
    onSelect,
    fond,
    onGlossClick,
    onBlock,
    isBlocked,
    isOwn,
    lang
}: GlossProps) => {
    const [menuOpen, setMenuOpen ] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)
    const [glossIdOpen, setGlossIdOpen ] = useState(false)

    const [isShowToast, setIsShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    

    const handleShare = async () => {
    const url = `${window.location.origin}/gloss/${glossData.glossId}`;

        await navigator.clipboard.writeText(url);
        
    };
    

    const { iconUrl: userIconUrl , subIcon: userSubIcon } = user;
    const { iconUrl: roomIconUrl , subIcon: roomSubIcon } = room;

    const source = glossData.media?.source;
    const type = glossData.media?.type;

    const url = glossData.mediaEmbed?.url;

    const topicContent = glossData.topic?.topicContent;

    const handleReport = (type: ReportType) => {
        onSelect?.({
                reporterId: "auth-user-id", // TODO: replace with actual auth user id
                type,
                createdAt: Date.now()
            });
        };
    

    // text to link

    const getDisplayUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname.replace(/^www\./, "");
            return hostname;
        } catch {
            return url;
        }
        };

        const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return text.split(urlRegex).map((part, i) => {
            if (part.match(/^https?:\/\/[^\s]+$/)) {
            return (
                <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                >
                {getDisplayUrl(part)}
                </a>
            );
            }

            return <span key={i}>{part}</span>;
        });
    };

    // Date caluculate

    const formatPostedAt = (postedAt: string, lang: 'ja' | 'en' = 'ja') => {
        const now = new Date();
        const date = new Date(postedAt);
        const diffMs = now.getTime() - date.getTime();

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diffMs < minute) {
            return lang === 'ja' ? '今' : 'now';
        }

        if (diffMs < hour) {
            const mins = Math.floor(diffMs / minute);
            return lang === 'ja' ? `${mins}分前` : `${mins}m ago`;
        }

        if (diffMs < day) {
            const hours = Math.floor(diffMs / hour);
            return lang === 'ja' ? `${hours}時間前` : `${hours}h ago`;
        }

        if (diffMs < day * 7) {
            const days = Math.floor(diffMs / day);
            return lang === 'ja'
            ? days === 1 ? '1日前' : `${days}日前`
            : days === 1 ? '1 day ago' : `${days} days ago`;
        }

        return lang === 'ja'
            ? date.toLocaleDateString('ja-JP')
            : date.toLocaleDateString('en-US');
    };

    return (
    <div
        className={`gloss padding-md inline-md bg-color-primary text-color-primary ${className ?? ""}`}
        onClick={() => onGlossClick?.(glossData.glossId)}
    >
            {isInFeed && (<button type="button" onClick={() => action.onRoom(glossData)} className="gloss__icon-button"><RoomCustomIcon roomIconUrl={roomIconUrl} subIcon={roomSubIcon} className="gloss__icon" /></button>)}
            {!isInFeed && (isInRoom || isInSalon) && (
                <button type="button" onClick={isInRoom ? () => action.onSalon?.(glossData) : () => action.onRoom(glossData)} title={isInRoom ? "Go to Salon" : "Go to Room"} className="gloss__icon-button"><UserCustomIcon iconUrl={userIconUrl} subIcon={userSubIcon} className="gloss__icon" /></button>)}
            <div className="gloss__content-wrapper stack-md">
                <div className="gloss__content-container stack-sm">
                    <div className="gloss__name-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                setMenuOpen(true);
                                e.stopPropagation();
                            }}
                            className="gloss__menu" />
                        {isInRoom && (
                            <WhereYouAre 
                                isInSalon={false} 
                                isInRoom={true} 
                                onRoom={(e) => {
                                    e.stopPropagation()
                                    action.onRoom(glossData)
                                }}
                                roomName={glossData.roomName} 
                                onSalon={(e) => {
                                    e.stopPropagation()
                                    action.onSalon?.(glossData)
                                }} 
                                salonName={glossData.salonName}
                            />)}
                        {isInFeed && (
                            <WhereYouAre 
                                isInSalon={false} 
                                isInRoom={false} 
                                onRoom={(e) => {
                                    e.stopPropagation()
                                    action.onRoom(glossData)
                                    }}
                                roomName={glossData.roomName}
                                onSalon={(e) => {
                                    e.stopPropagation()
                                    action.onSalon?.(glossData)
                                }}
                                salonName={glossData.salonName}
                            />)}
                        <div className="gloss__name inline-xs"><span>{glossData.userName}</span><span className="gloss__date">{formatPostedAt(glossData.postedAt, lang)}</span></div>
                    </div>
                    {notification && (<Notification type={notification.type} />)}
                    <div className="gloss__content">{renderTextWithLinks(glossData.content)}</div>
                    {source && source.length > 0 && (<Media source={source} type={type} lang={lang!} />)}
                    {url && (
                        <MediaEmbed 
                            url={url}
                            onClick={(e) => {
                                e.stopPropagation()
                                onSeeAlso
                            }} 
                        />
                    )}
                    {topicContent && (
                        <TopicContent 
                        topic={glossData.topic!}
                        lang={lang}
                        onClick={(e)=> {
                            e.stopPropagation()
                            onTopicSeeAlso
                        }} />)}
                    {revaluation && <Revaluation
                        lang={lang}
                        onYes={(e) => {
                            e.stopPropagation()
                            revaluation.onYes(glossData.glossId)
                        }}
                        onNo={(e) => {
                            e.stopPropagation()
                            revaluation.onNo(glossData.glossId)
                        }}
                    />}
                </div>
                <div className="gloss__action inline-md">
                    <FondButton
                        glossData={{ ...glossData }}
                        onClick={action.onFond}
                        isPressed={fond.isPressed} />
                    <ReplyButton
                        onClick={(e) => {
                        e.stopPropagation();
                        action.onReply(glossData);
                    }} 
                    replyCount={glossData.replyCount} />
                </div>
            </div> 
            <GlossMenu  
                onShare={async () => {
                    await handleShare();
                    setToastMessage("URL Copied");

                    setIsShowToast(true);
                    setMenuOpen(false);

                    setTimeout(() => {
                        setIsShowToast(false);
                    }, 2000);
                }}
                onBlock={() => {
                    onBlock();
                    setMenuOpen(false);
                }}
                onMessage={() => {
                    setToastMessage("Coming Soon");
                    setIsShowToast(true);
                    setMenuOpen(false);

                    setTimeout(() => {
                        setIsShowToast(false);
                    }, 2000);
                }}
                onReport={() => {
                    setReportOpen(true);
                    setMenuOpen(false);
                }}
                onId={() => {
                    setGlossIdOpen(true);
                    setMenuOpen(false);
                }}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                isBlocked={isBlocked}
                isOwn={isOwn}
            />

            <ReportMenu onSelect={handleReport} isOpen={reportOpen} onClose={() => setReportOpen(false)} />
            <ShowGlossId glossId={glossData.glossId} isOpen={glossIdOpen} onClose={() => setGlossIdOpen(false)} />

            {isShowToast && (
                    <div className="toast">
                        {toastMessage}
                    </div>
                )}
        </div>
    )
}