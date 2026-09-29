import { Option } from "@/app/components/buttons/Option";

import { useState } from "react";

import './QuestionContainer.scss'

type Props = {
    // 選んだ選択肢の id を返す(採点は DB 側で行うため score は扱わない)
    onSelected: (optionId: string) => void;
    questionNumber: number;
    question: string;
    options: { id: string; text: string }[];
}

export const QuestionContainer= ({ onSelected, questionNumber, question, options }: Props) => {
    const [selected, setSelected] = useState<string | null>(null);
    return(
        <div className="question-container padding-sm stack-sm bg-color-primary text-color-primary">
            <div className="question-container__number">Question {questionNumber}</div>
            <div className="question-container__question">{question}</div>
            {options.map((option) => (
                <Option
                    key={option.id}
                    label={option.text}
                    value={option.id}
                    isSelected={selected === option.id}
                    onSelect={(value) => {
                        setSelected(value);
                        onSelected(value);
                    }}
                />
            ))}
        </div>
    )
}
