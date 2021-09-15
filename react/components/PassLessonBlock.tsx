import Button from './Button';
import React, { ReactElement } from 'react';
import Input from './form/Input';

function PassLessonBlock({ isLessonPassed, onClickPass }): ReactElement {
    if (isLessonPassed) {
        return <div>Урок зачтен</div>
    }
    return (
        <div>
            <div>
                <h5>За домашнюю работу</h5>
                <Input type="number" value="" onChange={() => {}} label="Выполнено"/>
                <Input type="number" value="" onChange={() => {}} label="Из скольки"/>
            </div>
            <Button green onClick={onClickPass}>Зачесть урок'</Button>
        </div>
    );
}
export default PassLessonBlock;