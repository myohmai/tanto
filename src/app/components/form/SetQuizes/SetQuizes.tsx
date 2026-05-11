import { SetQuestion, QuestionOption } from "@/app/components/form/SetQuestion";
import { AddQuestionButton } from "@/app/components/buttons/AddQuestionButton";

import { useState } from "react";

import './SetQuizes.scss'

export type QuizeList = {
    id: string;
    question: string;
    option: QuestionOption[];
}

type Props = {
    quizes?: QuizeList[] | null;
    onQuizes: (value: QuizeList[]) => void;
    isSubmitted: boolean;
}

export const SetQuizes = ({ quizes, onQuizes, isSubmitted }: Props ) => {
    const [questions, setQuestions] = useState<QuizeList[]>(
        quizes?.length
            ? quizes
            : [
                {
                    id: crypto.randomUUID(),
                    question: "",
                    option: [
                        {
                            id: crypto.randomUUID(),
                            text: "",
                            score: 0
                        }
                    ]
                }
            ]
    );
    return(
        <div className="set-quizes stack-sm">
            {questions.map((question, index) => {
                return (
                    <SetQuestion
                        key={question.id}
                        questionNumber={index + 1}
                        isSubmitted={isSubmitted}
                        onQuestion={(value) => {
                            const newQuestions = [...questions];
                            newQuestions[index] = {
                                ...newQuestions[index],
                                question: value,
                            };
                            setQuestions(newQuestions);
                            onQuizes(newQuestions);
                        }}
                        onOption={(options) => {
                            const newQuestions = [...questions];
                            newQuestions[index] = {
                                ...newQuestions[index],
                                option: options,
                            };
                            setQuestions(newQuestions);
                            onQuizes(newQuestions);
                        }}
                        onDelete={() => {
                            const newQuestions = questions.filter((_, i) => i !== index);
                            setQuestions(newQuestions);
                            onQuizes(newQuestions);
                        }}
                    />
                );
            })}
            {questions.length < 5 && (
                <AddQuestionButton
                onClick={() => {
                    const newQuestions = [
                        ...questions,
                        { 
                            id: crypto.randomUUID(), 
                            question: "",
                            option: [
                                {id: crypto.randomUUID(), text: "", score: 0}
                            ]
                        }
                    ];
                    setQuestions(newQuestions);
                    onQuizes(newQuestions);
                }} />
            )}
        </div>
    )
}