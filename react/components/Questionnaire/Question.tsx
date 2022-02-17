import React from 'react';
import Textarea from '../form/Textarea';

function Question({ question, onChange, answer }) {
    return (
        <Textarea
            onChange={onChange}
            value={answer}
            label={question}
        />
    );
}

export default Question;