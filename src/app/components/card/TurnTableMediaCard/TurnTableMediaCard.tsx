import { MediaPlayButton } from "@/app/components/buttons/MediaPlayButton";
import { MediaSound } from "@/app/components/buttons/MediaSound";
import { LocationIcon, TrashIcon } from "@/app/components/icons";
import { PulldownArrow } from "@/app/components/buttons/PulldownArrow";
import { SeeAlso } from "@/app/components/media/SeeAlso";

import { useState } from "react";

import type { MusicService,TurnTableData } from '@/app/types/turntable';

import './TurnTableMediaCard.scss'


type Props = {
    turntableData: TurnTableData;
    hasSeeAlso?: Boolean;
    onSeeAlso?: () => void;
    onDelete?: () => void;
    primaryService: MusicService;
    service: {
        onYoutube: () => void;
        onSpotify: () => void;
        onAppleMusic: () => void;
    }
    isPaused: boolean;
    isMuted: boolean;
    onPause: () => void;
    onMute: () => void;
    progress: number;
}

export const TurnTableMediaCard = ({
    turntableData,
    hasSeeAlso,
    onSeeAlso,
    onDelete,
    primaryService,
    service,
    isPaused,
    isMuted,
    onPause,
    onMute,
    progress

}: Props ) => {
    const [isOpen, setIsOpen] = useState(false)
    return(
        <div className="turn-table-media-card bg-color-primary padding-lg stack-sm">
            {turntableData.music?.cover && (
                <img src={turntableData.music.cover} className="turn-table-media-card__cover" />
            )}
            <div className="turn-table-media-card__info text-color-primary stack-xs">
                <div className="turn-table-media-card__song-name">{turntableData.music?.title}</div>
                <div className="turn-table-media-card__artist-name">{turntableData.music?.artist}</div>
            </div>
            <div className="turn-table-media-card__player">
                <div className="turn-table-media-card__player--button">
                    <MediaPlayButton isPaused={isPaused} onClick={() => {onPause}} />
                </div>
                <div className="turn-table-media-card__player--utility">
                    <MediaSound isMuted={isMuted} onToggleMute={() => {onMute;}} />
                </div>
            </div>
            <div className="turn-table-media-card__player-bar bg-color-secondary">
                <div className="turn-table-media-card__player-bar--duration" style={{width: `${progress}%`}}>
                    <div className="turn-table-media-card__player-bar--knob"></div>
                </div>
            </div>
            <div className="turn-table-media-card__footer">
                <div className="turn-table-media-card__location  text-color-secondary inline-xs">
                    <LocationIcon className="icon-color-secondary" />
                    <span>{primaryService}</span>
                    <div className={`turn-table-media-card__pulldown--wrapper inline-xs ${isOpen ? 'open bg-color-secondary' : ''}`}>
                        <ul className={`turn-table-media-card__pulldown stack-sm ${isOpen ? 'open' : ''}`}>
                            <li className="turn-table-media-card__pulldown--list">
                                <button type="button" onClick={() => service.onAppleMusic()} className="text-color-secondary">Apple Music</button>
                                <button type="button" onClick={() => service.onSpotify()} className="text-color-secondary">Spotify</button>
                                <button type="button" onClick={() => service.onYoutube()} className="text-color-secondary">YouTube</button>
                            </li>
                        </ul>
                        <PulldownArrow onToggle={() => {
                            setIsOpen((prev) => !prev);
                        }} isOpen={isOpen} />
                    </div>
                </div>
                {hasSeeAlso && (<SeeAlso onClick={onSeeAlso!} />)}
                    {onDelete && (
                        <button type="button" onClick={onDelete} className="icon-color-secondary">
                            <TrashIcon />
                        </button>
                    )}
            </div>
        </div>
    )
}