import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';
import Textarea from './form/Textarea';
import Select from './form/Select';

function LessonEditForm({ onSubmit, name, alias, text, video, topics, topicId }): ReactElement {
    const [lessonName, setLessonName] = useState(name);
    const [lessonAlias, setLessonAlias] = useState(alias);
    const [lessonDescription, setLessonDescription] = useState(text || '');
    const [lessonVideo, setLessonVideo] = useState(video || '');
    const [lessonCategory, setLessonCategory] = useState(topicId);

    useEffect(() => {
        setLessonAlias(slugify(lessonName));
    }, [lessonName]);

    function handleSubmit() {
        onSubmit({
            name: lessonName,
            alias: lessonAlias,
            text: lessonDescription,
            video: lessonVideo,
            topicId: lessonCategory || topics[0]?.value
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setLessonName} label="Название" value={lessonName}/>
            <Select options={topics} label="Категория" onChange={setLessonCategory} value={lessonCategory} />
            <Textarea onChange={setLessonDescription} label="Описание" value={lessonDescription}/>
            <Input required onChange={setLessonAlias} label="Alias" value={lessonAlias}/>
            <Button block green>Сохранить</Button>
        </Form>
    );
}

export default LessonEditForm;