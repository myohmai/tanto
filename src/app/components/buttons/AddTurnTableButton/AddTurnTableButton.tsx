import { AddIcon } from '@/app/components/icons';
import './AddTurnTableButton.scss';

type Props = {
    onClick: () => void;
}

export const AddTurnTableButton = ({ onClick }: Props) => {
    return (
        <button type='button' onClick={onClick} className='add-turn-table-button' aria-label='Add Turn Table Media' >
            <AddIcon size="md" className='add-turn-table-button__icon' />
        </button>
    );
}