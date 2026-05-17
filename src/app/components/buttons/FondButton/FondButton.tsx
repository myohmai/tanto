import './FondButton.scss';
import { FondIcon, FondLineIcon } from '@/app/components/icons';
import type { FondLevel } from '@/app/components/icons/types';

import type { GlossData } from "@/app/types/gloss";

type Props = {
    glossData: GlossData;
    isPressed?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const getFondLevel = (
    fondCount: number,
    reportCount: number
): FondLevel => {
    const score = Math.max(0, fondCount - reportCount * 5);
    if (score >= 1000) return '500';
    if (score >= 800) return '400';
    if (score >= 600) return '300';
    if (score >= 400) return '200';
    return '100';
}

export const FondButton = ({ glossData, isPressed, onClick }: Props) => {
    const fondCount = glossData.fondCount;
    const reportCount = glossData.reports?.length ?? 0;
    const level = getFondLevel(fondCount, reportCount);
    
    // TODO: calculate FondLevel from value (threshold logic)
    let fondHeart;
    if (fondCount === 0) {
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
