import './MediaSound.scss'
import { SpeakerIcon, MuteIcon } from '@/app/components/icons';

type Props = {
    isMuted: boolean;
    onToggleMute: () => void;
}

export const MediaSound = ({ isMuted, onToggleMute }: Props) => {
    return (
        <button className='media-sound' onClick={onToggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <MuteIcon size="sm" className='media-sound__icon' /> : <SpeakerIcon size="sm" className='media-sound__icon' />}
        </button>
    );
}