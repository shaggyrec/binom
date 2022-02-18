import React, { useState } from 'react';
import Question from './Question';
import Button from '../Button';

function Questionnaire({ questions, onSubmit }) {
    const [answers, setAnswers] = useState({});

    function changeAnswer(id, answer) {
        setAnswers({ ...answers, [id]: { questionId: id, answer } })
    }

    function handleSubmit() {
        onSubmit(Object.values(answers));
    }

    return (
        <div>
            <div>
                {questions.map(q => (
                    <Question
                        key={`questionnaire-question${q.id}`}
                        question={q.question}
                        answer={answers[q.id]?.answer}
                        onChange={(a) => changeAnswer(q.id, a)}
                    />
                ))}
            </div>
            <div>
                <Button green onClick={handleSubmit}>Продолжить</Button>
            </div>
        </div>
    );
}

export default Questionnaire;