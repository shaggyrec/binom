import Button from './Button';
import React, { ReactElement, useState } from 'react';
import Input from './form/Input';
import Paddingable from './Paddingable';

function PassLessonBlock({ isLessonPassed, onClickPass }): ReactElement {

    const [passTasks, setPassTasks] = useState('');
    const [maxTask, setMaxTask] = useState('');

    function handleSubmit(e): void {
        e.preventDefault();
        if (confirm(`Поставить зачет: домашняя работа ${passTasks}/${maxTask}?`)) {
            onClickPass(parseInt(passTasks), parseInt(maxTask));
        }
    }

    if (isLessonPassed) {
        return (
            <div className="flex">
                <div className="badge"><Paddingable padding={[10, 15]}>Урок зачтен</Paddingable></div>
            </div>
        );
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h5>За домашнюю работу</h5>
                <div className="flex gap-10 flex-vertical-centered">
                    <Input min={0} required type="number" value={passTasks} onChange={setPassTasks} label="Выполнено"/> <span className="my-0 h1">/</span>
                    <Input min={1} required type="number" value={maxTask} onChange={setMaxTask} label="Из скольки"/>
                </div>
            </div>
            <Button type="submit" green>Зачесть урок</Button>
        </form>
    );
}
export default PassLessonBlock;