import { PulldownArrow } from "@/app/components/buttons/PulldownArrow";
import { useState, useEffect } from "react";

import './ScoresPulldown.scss'

type Props = {
    value?: number;
    onChange?: (score: number) => void;
}

export const ScoresPulldown = ({ value = 3, onChange }: Props ) => {
    const [isOpen, setIsOpen ] = useState(false)
    const [selectedScore, setSelectedScore] = useState(value);
    useEffect(() => {
        setSelectedScore(value);
    }, [value]);
    const SCORE_OPTIONS = [
        { label: "3", value: 3 },
        { label: "2", value: 2 },
        { label: "1", value: 1 },
        { label: "0", value: 0 },
        ];
    const selectedLabel =
        SCORE_OPTIONS.find(o => o.value === selectedScore)?.label;
    return (
        <div className="score-pulldown padding-sm inline-sm bg-color-primary text-color-primary">
            {isOpen ? 
                <div className="score-pulldown__wrapper stack-sm">
                    <div className="score-pulldown__scores stack-sm">
                        {SCORE_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setSelectedScore(option.value);
                                setIsOpen(false);
                                onChange?.(option.value);
                            }}
                        >
                            {option.label}
                        </button>
                ))}
                    </div>
                    <div className="score-pulldown__label">score</div>
                </div>
            :
            <div className="score-pulldown__selected-score">{selectedScore}</div>
            }
            <PulldownArrow isOpen={isOpen} onToggle={() => {setIsOpen((prev) => !prev)}} />
        </div>
    )
}