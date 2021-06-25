import React, { ReactElement } from 'react';
import { Lesson } from '../dataTypes/lesson';

function Lesson(props: Lesson): ReactElement {
    return (
        <div>
            <h1>{props.name}</h1>
            <p>{props.video}</p>
            <p>{props.text}</p>
        </div>
    );
}
export default Lesson;