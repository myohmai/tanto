import { QuestionContainer } from "@/app/components/form/QuestionContainer";
import type { PrivateRoomQuizQuestion } from "@/repositories/privateRoom";

import { useState } from "react";

import './QuizContainer.scss'

type Props = {
    // 各設問で選んだ選択肢の id(未回答の設問は含まない)
    onAnswers: (optionIds: string[]) => void;
    questions: PrivateRoomQuizQuestion[] | undefined;
}

export const QuizContainer = ({ onAnswers, questions }: Props) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleSelect = (questionId: string, optionId: string) => {
        const next = { ...answers, [questionId]: optionId };
        setAnswers(next);
        onAnswers(Object.values(next));
    };

    return (
        <div className="quiz-container bg-color-primary">
            {questions?.slice(0, 5).map((q, index) => (
                <QuestionContainer
                    key={q.id}
                    questionNumber={index + 1}
                    question={q.question}
                    options={q.option}
                    onSelected={(optionId) => handleSelect(q.id, optionId)}
                />
            ))}
        </div>
    );
}
