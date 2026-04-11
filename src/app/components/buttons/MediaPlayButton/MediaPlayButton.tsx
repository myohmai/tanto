import { PlayIcon, PauseIcon } from '@/app/components/icons'
import './MediaPlayButton.scss'

type Props = {
    isPaused: boolean;
    onClick: () => void;
}

export const MediaPlayButton = ({ isPaused, onClick }: Props ) => {
    return(
        <button type="button" onClick={onClick} className="media-play-button" aria-label={isPaused ? "Play" : "Pause"}>
            { isPaused? <PlayIcon size="lg" className='icon-color-primary'/> : <PauseIcon size="lg" className='icon-color-primary'/>}
        </button>
    );
}