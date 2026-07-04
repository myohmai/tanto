import { AddSalonIcon } from '@/app/components/icons';
import './CreateSalonButton.scss';

type Props = {
    onClick: () => void;
}

export const CreateSalonButton = ({ onClick }: Props) => {
    return (
        <button type='button' onClick={onClick} className='create-salon-button' aria-label='Create new Salon' >
            <AddSalonIcon size="md" className='create-salon-button__icon' />
        </button>
    );
}