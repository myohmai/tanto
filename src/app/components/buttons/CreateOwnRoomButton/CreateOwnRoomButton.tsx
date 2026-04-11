import { AddIcon } from '@/app/components/icons';
import './CreateOwnRoomButton.scss';

type Props = {
    onClick: () => void;
}

export const CreateOwnRoomButton = ({ onClick }: Props) => {
    return (
        <button type='button' onClick={onClick} className='create-own-room-button' aria-label='Create own Room' >
            <AddIcon size="md" className='create-own-room-button__icon' />
        </button>
    );
}