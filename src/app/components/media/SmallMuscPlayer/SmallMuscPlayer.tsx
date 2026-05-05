import { MediaPlayButton } from "@/app/components/buttons/MediaPlayButton";
import { ArrowRightIcon } from "@/app/components/icons";

import './SmallMuscPlayer.scss'

type Props = {
    cover: {
        src: string;
        alt: string;
    }
    songName: string;
    artistName: string;
    isPaused: boolean;
    onPause: () => void;
    onRoom: () => void;
    progress: number;
}

export const SmallMusicPlayer = ({
    cover,
    songName,
    artistName,
    isPaused,
    onPause,
    onRoom,
    progress
}: Props ) => {
    return (
        <div className="small-music-player bg-color-primary text-color-primary">
            <div className="small-music-player__music inline-md">
                <img src={cover.src} alt={cover.alt} className="small-music-player__cover" />
                <div className="small-music-player__info stack-xs">
                    <div className="small-music-player__song-name">{songName}</div>
                    <div className="small-music-player__artist-name">{artistName}</div>
                </div>
            </div>
            <div className="small-music-player__buttons inline-md">
                <MediaPlayButton isPaused={isPaused} onClick={onPause} />
                <button type="button" onClick={onRoom} aria-label="to Room" className="small-music-player__to-room"><ArrowRightIcon className="icon-color-primary"/></button>
            </div>
            <div className="small-music-player__player-bar bg-color-secondary">
                <div className="small-music-player__player-bar--duration" style={{width: `${progress}%`}}>
                    <div className="small-music-player__player-bar--knob"></div>
                </div>
            </div>
        </div>
    )
}