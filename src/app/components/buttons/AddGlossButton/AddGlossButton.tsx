import { GlossIcon } from '@/app/components/icons';
import './AddGlossButton.scss';

type Props = {
    onClick: () => void;
}

export const AddGlossButton = ({ onClick }: Props) => {
    return (
        <button type='button' onClick={onClick} className='add-gloss-button' aria-label='Add new Gloss' >
            <GlossIcon size="md" className='add-gloss-button__icon' />
        </button>
    );
}