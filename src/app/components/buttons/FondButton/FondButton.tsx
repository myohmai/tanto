import './FondButton.scss';
import { FondIcon, FondLineIcon } from '@/app/components/icons';
import type { FondLevel } from '@/app/components/icons/types';

type Props = {
    value: number;
    isPressed?: boolean;
    onClick: () => void;
}

export const FondButton = ({ value, isPressed, onClick }: Props) => {
    const level = value.toString() as FondLevel; // Convert number to string and assert as FondLevel
    // TODO: calculate FondLevel from value (threshold logic)
    let fondHeart;
    if (value === 0) {
        fondHeart = <FondLineIcon size="md" className="fond-button__icon icon-color-secondary" />;
        } else if (!isPressed) {
            fondHeart = <div className="fond-button__icon-wrapper"><FondIcon size="md" level={level} className="fond-button__icon--not-pressed" /><FondLineIcon size="md" className="fond-button__icon--not-pressed-line icon-color-secondary" /></div>;
        } else {
            fondHeart = <FondIcon size="md" level={level} className="fond-button__icon" />;
        }
    return (
        <button className={`fond-button ${isPressed ? 'pressed' : ''}`} onClick={onClick}>
            {fondHeart}
        </button>
    );
}