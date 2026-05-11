import { QuestionContainer } from "@/app/components/form/QuestionContainer";
import { QuizeList } from "@/app/components/form/SetQuizes";

import { useState } from "react";

import './QuizContainer.scss'

type Props = {
    onScore: (value: number) => void;
    questions: QuizeList[] | undefined;
}

export const QuizContainer = ({ onScore, questions }: Props) => {
    const [scores, setScores] = useState<number[]>([]);

    const handleSelect = (index: number, score: number) => {
        const newScores = [...scores];
        newScores[index] = score;
        setScores(newScores);

        const total = newScores.reduce((sum, s) => sum + (s ?? 0), 0);
        onScore(total);
    };

    return (
        <div className="quiz-container bg-color-primary">
            {questions?.slice(0, 5).map((q, index) => (
                <QuestionContainer
                    key={q.id}
                    questionNumber={index + 1}
                    question={q.question}
                    options={q.option}
                    onSelected={(score) => handleSelect(index, score)}
                />
            ))}
        </div>
    );
}