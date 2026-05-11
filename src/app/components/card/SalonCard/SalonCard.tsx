import { FondIcon, BiasColor, PinIcon, ArrowRightIcon } from "@/app/components/icons";
import { SalonIcon } from "@/app/types/salon";

import './SalonCard.scss'


type Props = {
    salonName: string;
    onSalon: () => void;
    icon: SalonIcon;
    latestPostedAt: string;
    glossCount: number;
    latestImages?: string[];
    isPinned: Boolean;
}

export const SalonCard = ({
    salonName,
    onSalon,
    icon,
    latestPostedAt,
    glossCount,
    latestImages,
    isPinned
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
        <button type="button" onClick={onSalon} className="salon-card padding-lg-md bg-color-primary text-color-primary">
            <div className="salon-card__salon-info inline-lg">
                {icon?.type === 'emoji' && (<span className="salon-card__emoji">{icon.value}</span>)}
                {icon?.type === 'fond' && (<FondIcon size="lg" bias={icon.value} className="salon-card__fond" />)}
                <div className="salon-card__salon-info-container stack-xs">
                    <div className="salon-card__name-wrapper">
                        <span className="salon-card__salon-name">{salonName}</span>
                        {isPinned && (<PinIcon variant="fill" className="salon-card__pin icon-color-primary" />)}
                    </div>
                    <div className="room-card--inner-container inline-sm">
                        <span className="salon-card__count">
                            {formatGlossCount(glossCount)} Glosses
                        </span>
                        <span className="salon-card__posted_at text-color-secondary">
                            {formatPostedAt(latestPostedAt)}
                        </span>
                    </div>
                </div>
                <div className="salon-card__arrow-wrapper">
                    <div className="salon-card__image-wrapper">
                        {latestImages?.slice(0, 3).map((src, i) => (<img key={i} src={src} alt="" />))}
                    </div>
                    <ArrowRightIcon className="salon-card__arrow icon-color-secondary" />
                </div>
            </div>

        </button>
    )
}