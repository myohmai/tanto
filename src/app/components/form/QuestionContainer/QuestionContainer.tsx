import { Option } from "@/app/components/buttons/Option";
import { QuestionOption } from "@/app/components/form/SetQuestion"
import { QuizeList } from "@/app/components/form/SetQuizes";

import { useState } from "react";

import './QuestionContainer.scss'

type Props = {
    onSelected: (value: QuestionOption["score"]) => void;
    questionNumber: number;
    question: QuizeList["question"];
    options: QuizeList["option"];
}

export const QuestionContainer= ({ onSelected, questionNumber, question, options }: Props) => {
    const [selected, setSelected] = useState<number | null>(null);
    return(
        <div className="question-container padding-sm stack-sm bg-color-primary text-color-primary">
            <div className="question-container__number">Question {questionNumber}</div>
            <div className="question-container__question">{question}</div>
            {options.map((option) => (
                <Option
                    key={option.id}
                    label={option.text}
                    value={String(option.score)}
                    isSelected={selected === option.score}
                    onSelect={(value) => {
                        const num = Number(value);
                        setSelected(num);
                        onSelected(num);
                    }}
                />
            ))}
        </div>
    )
}