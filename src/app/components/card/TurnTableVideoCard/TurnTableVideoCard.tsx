import { LocationIcon } from "@/app/components/icons";
import { SeeAlso } from "@/app/components/media/SeeAlso";

import type { TurnTableData } from '@/app/types/turntable';

import './TurnTableVideoCard.scss'


type Props = {
    turntableData: TurnTableData;
    hasSeeAlso?: Boolean;
    onSeeAlso?: () => void;
}

export const TurnTableVideoCard = ({
    turntableData,
    hasSeeAlso,
    onSeeAlso,
}: Props ) => {
    return(
        <div className="turn-table-video-card bg-color-primary padding-lg stack-sm">
            <div className="turn-table-video-card__frame">
                <iframe
                src={`https://www.youtube.com/embed/${turntableData.video?.videoId}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                />
            </div>
            <div className="turn-table-video-card__info text-color-primary stack-xs">
                <div className="turn-table-video-card__video-name">{turntableData.video?.title}</div>
                <div className="turn-table-video-card__channel-name">{turntableData.video?.channelName}</div>
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