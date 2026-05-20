import './FondButton.scss';
import { FondIcon, FondLineIcon } from '@/app/components/icons';

import type { GlossData } from "@/app/types/gloss";
import { calcFondLevel } from "@/app/logic/gloss/calcFondLevel";

type Props = {
    glossData: GlossData;
    isPressed: (glossId: string) => boolean;
    onClick: (glossId: string) => void;
}

export const FondButton = ({ glossData, isPressed, onClick }: Props) => {
    const fondCount = glossData.fondCount;
    const level = calcFondLevel(glossData);

    let fondHeart;
    if (fondCount === 0) {
        fondHeart = <FondLineIcon size="md" className="fond-button__icon icon-color-secondary" />;
    } else if (!isPressed(glossData.glossId)) {
        fondHeart = <div className="fond-button__icon-wrapper"><FondIcon size="md" level={level} className="fond-button__icon--not-pressed" /><FondLineIcon size="md" className="fond-button__icon--not-pressed-line icon-color-secondary" /></div>;
    } else {
        fondHeart = <FondIcon size="md" level={level} className="fond-button__icon" />;
    }

    return (
        <button className={`fond-button ${isPressed(glossData.glossId) ? 'pressed' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick(glossData.glossId)
                }}>
            {fondHeart}
        </button>
    );
}
