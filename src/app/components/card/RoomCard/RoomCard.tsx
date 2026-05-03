import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { UserCustomIcon , UserSubIcon} from "@/app/components/custom-icon/UserCustomIcon";
import { PersonIcon, EditIcon, ArrowRightIcon } from "@/app/components/icons";
import { FondLevel } from "@/app/components/icons";

import './RoomCard.scss'

type Props = {
    room: {
        iconUrl: string;
        subIcon?: { type: 'fond'; value: FondLevel };
    }
    user?: {
        iconUrl: string;
        subIcon?: UserSubIcon;
    }
    roomName: string;
    userName: string;
    onRoom: () => void;
    onEdit?: () => void
    latestPostedAt: string;
    glossCount: number;
    latestImages?: string[];
    isInDashboard: boolean;
}

export const RoomCard = ({
    room,
    user,
    roomName,
    userName,
    onRoom,
    onEdit,
    latestPostedAt,
    glossCount,
    latestImages,
    isInDashboard
}: Props ) => {
     // Date caluculate

    const formatPostedAt = (latestPostedAt: string, lang: 'ja' | 'en' = 'ja') => {
        const now = new Date();
        const date = new Date(latestPostedAt);
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

    // Round Count
    const formatGlossCount = (count: number, locale = "ja") => {
        if (locale === "ja") {
            if (count >= 100000000) return `${(count / 100000000).toFixed(1)}億`;
            if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
            return count.toLocaleString("ja-JP");
        }

        if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toLocaleString("en-US");
    };
    const trim = (num: number) => num.toFixed(1).replace(".0", "");
    return (
        <div className="room-card padding-lg-md bg-color-primary text-color-primary">
            <button type="button" onClick={onRoom} className="room-card__room-wrapper">
                <div className="room-card__room-info inline-sm">
                    <RoomCustomIcon roomIconUrl={room.iconUrl} subIcon={room.subIcon} className="room-card__room-icon" />
                    <div className="room-card__room-info-container stack-xs">
                        <span className="room-card__room-name">{roomName}</span>
                        <div className="room-card__inner-container inline-sm">
                            <span className="room-card__count">
                                {formatGlossCount(glossCount)} Glosses
                            </span>
                            <span className="room-card__posted_at text-color-secondary">
                                {formatPostedAt(latestPostedAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="room-card__arrow-wrapper">
                    <div className="room-card__image-wrapper">
                        {latestImages?.slice(0, 3).map((src, i) => (<img key={i} src={src} alt="" />))}
                    </div>
                    <ArrowRightIcon className="room-card__arrow icon-color-secondary"/>
                </div>
            </button>
            {isInDashboard && (
                <button type="button" onClick={onEdit} className="room-card__user-wrapper bg-color-secondary padding-sm-lg inline-md">
                    <PersonIcon className="icon-color-secondary room-card__icon" />
                    <div className="room-card__user inline-sm">
                        <div className="room-card__user-icon-wrapper"><UserCustomIcon iconUrl={user?.iconUrl} subIcon={user?.subIcon} className="room-card__user-icon" /></div>
                        <div className="room-card__user-name">{userName}</div>
                    </div>
                    <EditIcon className="icon-color-secondary room-card__icon" />
                </button>
            )}
        </div>
    )
}