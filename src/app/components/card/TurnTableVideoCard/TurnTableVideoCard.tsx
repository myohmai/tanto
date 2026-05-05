import { LocationIcon } from "@/app/components/icons";
import { SeeAlso } from "@/app/components/media/SeeAlso";

import './TurnTableVideoCard.scss'


type Props = {
    videoId: string;
    title: string;
    channelName: string;
    hasSeeAlso?: Boolean;
    onSeeAlso?: () => void;
}

export const TurnTableVideoCard = ({
    videoId,
    title,
    channelName,
    hasSeeAlso,
    onSeeAlso,
}: Props ) => {
    return(
        <div className="turn-table-video-card bg-color-primary padding-lg stack-sm">
            <div className="turn-table-video-card__frame">
                <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                />
            </div>
            <div className="turn-table-video-card__info text-color-primary stack-xs">
                <div className="turn-table-video-card__video-name">{title}</div>
                <div className="turn-table-video-card__channel-name">{channelName}</div>
            </div>
            <div className="turn-table-video-card__footer">
                <div className="turn-table-video-card__location  text-color-secondary inline-xs">
                    <LocationIcon className="icon-color-secondary" />
                    <span>YouTube</span>
                </div>
                {hasSeeAlso && (<SeeAlso onClick={onSeeAlso!} />)}
            </div>
        </div>
    )
}