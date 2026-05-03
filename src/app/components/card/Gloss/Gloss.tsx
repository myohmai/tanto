import { FondIcon, BiasColor, FondLevel } from "@/app/components/icons"; 
import { UserCustomIcon, UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { RoomCustomIcon  } from "@/app/components/custom-icon/RoomCustomIcon";
import { WhereYouAre } from "@/app/components/content/WhereYouAre";
import { MenuButton } from "@/app/components/buttons/MenuButton";
import { Notification, NotificationType, NotificationMessage } from "@/app/components/evaluation/Notification";
import { Media, MediaItem } from "@/app/components/media/Media";
import { MediaLabelType } from "@/app/components/media/MediaLabel";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";
import { TopicContent } from "@/app/components/content/TopicContent";
import { Revaluation } from "@/app/components/evaluation/Revaluation";
import { FondButton } from "@/app/components/buttons/FondButton";
import { ReplyButton } from "@/app/components/buttons/ReplyButton";

import './Gloss.scss'


type GlossProps = {
    glossContent: string;
    isInFeed: boolean;
    isInRoom: boolean;
    isInSalon: boolean;
    roomName: string;
    salonName?: string;
    userName: string;
    postedAt: string;
    className?: string;
    user: {
        iconUrl: string;
        subIcon?: UserSubIcon;
    }
    room: {
        iconUrl: string;
        subIcon?: { type: 'fond'; value: FondLevel };
    }
    media?: {
        source: MediaItem[];
        type: MediaLabelType;
    }
    mediaEmbed?: {
        url: string;
        onSeeAlso?: () => void;
    }
    topic?: {
        topicContent: string;
        mediaSource?: MediaItem[];
        mediaType?: MediaLabelType;
        mediaEmbedUrl?: string;
        onTopicSeeAlso?: () => void;
    }
    notification?: {
        type: NotificationType;
    }
    revaluation?: {
        onYes: () => void;
        onNo: () => void;
    }
    action: {
        onRoom: () => void;
        onSalon?: () => void;
        onFond: () => void;
        onReply: () => void;
        onMenu: () => void;
    }
    fond: {
        value: number;
        isPressed: boolean;
    }
    reply: {
        count: number;
    }
    lang: 'en' | 'ja';
}

export const Gloss = ({
    glossContent,
    isInFeed,
    isInRoom,
    isInSalon,
    roomName,
    salonName,
    userName,
    postedAt,
    className,
    user,
    room,
    media,
    mediaEmbed,
    topic,
    notification,
    revaluation,
    action,
    fond,
    reply,
    lang
}: GlossProps) => {
    const { iconUrl: userIconUrl , subIcon: userSubIcon } = user;
    const { iconUrl: roomIconUrl , subIcon: roomSubIcon } = room;

    const source = media?.source;
    const type = media?.type;

    const url = mediaEmbed?.url;
    const onSeeAlso = mediaEmbed?.onSeeAlso;

    const topicContent = topic?.topicContent;
    const mediaSource = topic?.mediaSource;
    const mediaType = topic?.mediaType;
    const mediaEmbedUrl = topic?.mediaEmbedUrl;
    const onTopicSeeAlso = topic?.onTopicSeeAlso;

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
    <div className={`gloss padding-md inline-md bg-color-primary text-color-primary ${className ?? ""}`}>
            {isInFeed && (<button type="button" onClick={action.onRoom} className="gloss__icon-button"><RoomCustomIcon roomIconUrl={roomIconUrl} subIcon={roomSubIcon} className="gloss__icon" /></button>)}
            {!isInFeed && (isInRoom || isInSalon) && (<button type="button" onClick={isInRoom ? action.onSalon : action.onRoom} title={isInRoom ? "Go to Salon" : "Go to Room"} className="gloss__icon-button"><UserCustomIcon iconUrl={userIconUrl} subIcon={userSubIcon} className="gloss__icon" /></button>)}
            <div className="gloss__content-wrapper stack-md">
                <div className="gloss__content-container stack-sm">
                    <div className="gloss__name-wrapper">
                        <MenuButton onClick={action.onMenu} className="gloss__menu" />
                        {isInRoom && (<WhereYouAre isInSalon={false} isInRoom={isInRoom} onRoom={action.onRoom} roomName={roomName} onSalon={action.onSalon} salonName={salonName} />)}
                        <div className="gloss__name inline-xs"><span>{userName}</span><span className="gloss__date">{formatPostedAt(postedAt, lang)}</span></div>
                    </div>
                    {notification && (<Notification type={notification.type} lang={lang}/>)}
                    <div className="gloss__content">{renderTextWithLinks(glossContent)}</div>
                    {source && source.length > 0 && (<Media source={source} type={type!} lang={lang!} />)}
                    {url && (<MediaEmbed url={url} onClick={onSeeAlso} />)}
                    {topicContent && (<TopicContent topicContent={topicContent} source={mediaSource} type={mediaType} lang={lang} url={mediaEmbedUrl} onClick={onTopicSeeAlso} />)}
                    {revaluation && <Revaluation lang={lang} onYes={revaluation.onYes} onNo={revaluation.onNo} />}
                </div>
                <div className="gloss__action inline-md">
                    <FondButton value={fond.value} onClick={action.onFond} isPressed={fond.isPressed} />
                    <ReplyButton onClick={action.onReply} replyCount={reply.count} />
                </div>
            </div>           
        </div>
    )
}