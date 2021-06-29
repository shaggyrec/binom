import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';
import Textarea from './form/Textarea';
import Select from './form/Select';
import FileUpload from './form/FileUpload';
import Video from './Video';
import { SERVER_REQUESTS_BASE } from '../functions';
import Paddingable from './Paddingable';
import { Bin } from './Icons';

function videoEdition(videoId, onClickDeleteVideo): ReactElement {
    return (
        <div>
            <Video src={SERVER_REQUESTS_BASE + '/file/' + videoId}/>
            <Paddingable padding={[10, 0]}>
                <Button type="button" small red onClick={onClickDeleteVideo}><Bin size={15} fill="#fff"/> Удалить видео</Button>
            </Paddingable>
        </div>
    );
}

function LessonEditForm({ onSubmit, name, alias, text, video, topics, topicId, onFileUpload, loading = false, onClickDeleteVideo }): ReactElement {
    const [lessonName, setLessonName] = useState(name);
    const [lessonAlias, setLessonAlias] = useState(alias);
    const [lessonDescription, setLessonDescription] = useState(text || '');
    const [lessonCategory, setLessonCategory] = useState(topicId);

    useEffect(() => {
        setLessonAlias(slugify(lessonName));
    }, [lessonName]);

    function handleSubmit() {
        onSubmit({
            name: lessonName,
            alias: lessonAlias,
            text: lessonDescription,
            topicId: lessonCategory || topics[0]?.value
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setLessonName} label="Название" value={lessonName}/>
            <Select options={topics} label="Категория" onChange={setLessonCategory} value={lessonCategory} />
            {video ? videoEdition(video, onClickDeleteVideo) : <FileUpload name="file" onChange={onFileUpload} label="Видео" accept="video/*"/>}
            <Textarea onChange={setLessonDescription} label="Описание" value={lessonDescription}/>
            <Input required onChange={setLessonAlias} label="Alias" value={lessonAlias}/>
            <Button block green disabled={loading}>Сохранить</Button>
        </Form>
    );
}

export default LessonEditForm;