import { ArrowUpIcon, ArrowDownIcon } from '@/app/components/icons';
import './PulldownArrow.scss';

type Props = {
    isOpen: boolean;
    onToggle: () => void;
}

export const PulldownArrow = ({isOpen, onToggle}: Props ) => {
    return (
        <button className='pull-down-arrow' onClick={onToggle}>
            {isOpen ? <ArrowUpIcon size="md" className='icon-color-secondary' /> : <ArrowDownIcon size="md" className='icon-color-secondary' />}
        </button>
    );
}