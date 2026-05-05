import { DeleteQuestionButton } from "@/app/components/buttons/DeleteQuestionButton";
import { AddQuizOptionButton } from "@/app/components/buttons/AddQuizOptionButton";
import { DeleteQuizOptionButton } from "@/app/components/buttons/DeleteQuizOptionButton";
import { ScoresPulldown } from "@/app/components/form/ScoresPulldown";

import { useState } from "react";

import './SetQuestion.scss'

export type QuestionOption = {
    id: string;
    text: string;
    score: number;
}

type Props = {
    questionNumber: number;
    onQuestion: (value: string) => void;
    onOption: (value: QuestionOption[]) => void;
    onDelete: () => void;
    isSubmitted: boolean;
}

export const SetQuestion = ({ questionNumber, onQuestion, onOption, onDelete, isSubmitted }: Props ) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<QuestionOption[]>([
        { id: crypto.randomUUID(), text: "", score: 3 },
        { id: crypto.randomUUID(), text: "", score: 3 }
    ]);
    const isQuestionOver = question.length >= 120;
    const isQuestionEmpty = question.trim() === "";
    const isAllScoreZero = options.every(o => o.score === 0);
    return (
        <div className="set-question padding-sm stack-sm bg-color-primary text-color-primary">
            <div className="set-question__label">Question {questionNumber}</div>
            <DeleteQuestionButton onClick={onDelete} className="set-question__delete-question" />
            <textarea
                placeholder="Ask a question"
                value={question}
                maxLength={120}
                onChange={(e) => {
                    setQuestion(e.target.value);
                    onQuestion(e.target.value);
                }}
                className="set-question__question padding-sm"
            />
            {isSubmitted && isQuestionOver && (
                <div className="input-box__error">
                    Please enter within 120 characters
                </div>
            )}
            {isSubmitted && isQuestionEmpty && (
                <div className="input-box__error">
                    This field is required
                </div>
            )}
            {options.map((option, index)=> {
                const isOver = option.text.length > 40;
                const isEmpty = option.text.trim() === "";
                return (
                    <div className="set-question__option-wrapper inline-sm" key={option.id}>
                        <div className="set-question__option-container">
                            <input
                                type="text"
                                placeholder="Option" 
                                value={option.text} 
                                className="set-question__option padding-sm"
                                maxLength={40}
                                onChange={(e) => {
                                    const newOptions = [...options];
                                    newOptions[index] = {
                                        ...newOptions[index],
                                        text: e.target.value,
                                    };
                                    setOptions(newOptions);
                                    onOption(newOptions);
                                }}
                            />
                            {isSubmitted && isOver && (
                                <div className="input-box__error">
                                    Please enter within 40 characters
                                </div>
                            )}
                            {isSubmitted && isEmpty && (
                                <div className="input-box__error">
                                    This field is required
                                </div>
                            )}
                        </div>
                        <ScoresPulldown onChange={(score) => {
                            const newOptions = [...options];
                            newOptions[index] = {
                                ...newOptions[index],
                                score: score,
                            };
                            setOptions(newOptions);
                            onOption(newOptions);
                        }} />
                        {index === options.length - 1 && options.length < 4 && (
                            <AddQuizOptionButton
                                className="set-question__button"
                                onClick={() => {
                                    const newOptions = [
                                        ...options,
                                        { id: crypto.randomUUID(), text: "", score: 0 },
                                    ];
                                    setOptions(newOptions);
                                    onOption(newOptions);
                                }}
                            />
                        )}
                        {options.length > 1 &&  (
                            <DeleteQuizOptionButton
                                className="set-question__button"
                                onClick={() => {
                                    const newOptions = options.filter((_, i) => i !== index);
                                    setOptions(newOptions);
                                    onOption(newOptions);
                                }}
                            />
                            
                        )}

                    </div>
                );
            })}
            {isSubmitted && isAllScoreZero && (
                <div className="input-box__error">
                    At least one option must have a score
                </div>
            )}
        </div>
    )
}