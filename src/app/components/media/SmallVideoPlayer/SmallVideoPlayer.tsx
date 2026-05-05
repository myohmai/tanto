import { ArrowRightIcon } from "@/app/components/icons";

import './SmallVideoPlayer.scss'

type Props = {
    videoId: string;
    title: string;
    channelName: string;
    onRoom: () => void;
}

export const SmallVideoPlayer = ({
    videoId,
    title,
    channelName,
    onRoom
}: Props ) => {
    return (
        <div className="small-video-player bg-color-primary text-color-primary">
            <div className="small-video-player__frame">
                <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                />
            </div>
            <div className="small-video-player__wrapper inline-md">
                <div className="small-video-player__info stack-xs">
                    <div className="small-video-player__video-name">{title}</div>
                    <div className="small-video-player__channel-name">{channelName}</div>
                </div>
                <button type="button" onClick={onRoom} aria-label="to Room" className="small-video-player__to-room"><ArrowRightIcon className="icon-color-primary"/></button>
            </div>
        </div>
    )
}