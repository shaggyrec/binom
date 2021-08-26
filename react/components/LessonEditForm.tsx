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
import MathsTextarea from './form/MathsTextarea';

function videoEdition(videoId, onClickDeleteVideo): ReactElement {
    return (
        <div key={videoId} style={{ marginBottom: 10 }}>
            <Video src={SERVER_REQUESTS_BASE + '/file/' + videoId}/>
            <Paddingable padding={[10, 0]}>
                <Button type="button" small red onClick={onClickDeleteVideo}><Bin size={15} fill="#fff"/> Удалить видео</Button>
            </Paddingable>
        </div>
    );
}

function fileEdition(fileId, onClickDelete): ReactElement {
    return (
        <div key={fileId} className="flex gap-20" style={{ marginBottom: 10 }}>
            <a href={`${SERVER_REQUESTS_BASE}/file/${fileId}`} target="_blank" rel="noreferrer">{fileId}</a>
            <Paddingable padding={[10, 0]}>
                <Button type="button" small red onClick={onClickDelete}><Bin size={15} fill="#fff"/> Удалить файл</Button>
            </Paddingable>
        </div>
    );
}

function LessonEditForm({ onSubmit, name, alias, text, task, video, topics, topicId, taskFiles, onVideoUpload, onTaskUpload, loading = false, onClickDeleteFile }): ReactElement {
    const [lessonName, setLessonName] = useState(name);
    const [lessonAlias, setLessonAlias] = useState(alias);
    const [lessonDescription, setLessonDescription] = useState(text);
    const [lessonTask, setLessonTask] = useState(task);
    const [lessonCategory, setLessonCategory] = useState(topicId);

    useEffect(() => {
        setLessonAlias(slugify(lessonName));
    }, [lessonName]);

    function handleSubmit() {
        onSubmit({
            name: lessonName,
            alias: lessonAlias,
            text: lessonDescription,
            topicId: lessonCategory || topics[0]?.value,
            task: lessonTask,
        });
    }

    function handleTaskUpload(e, reset) {
        onTaskUpload(e);
        reset();
    }

    function handleVideoUpload(e, reset) {
        onVideoUpload(e);
        reset();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setLessonName} label="Название" value={lessonName}/>
            <Select options={topics} label="Категория" onChange={setLessonCategory} value={lessonCategory} />
            {video?.length && video.map(v => videoEdition(v, () => onClickDeleteFile(v)))}
            <FileUpload name="file" onChange={handleVideoUpload} label={video?.length ? 'Ещё видео' : 'Видео'} accept="video/*"/>
            <Textarea onChange={setLessonDescription} label="Описание" value={lessonDescription || ''}/>
            <MathsTextarea label="Задание" value={lessonTask || ''}  onChange={setLessonTask}/>
            {taskFiles?.length && taskFiles.map(v => fileEdition(v, () => onClickDeleteFile(v)))}
            <div style={{ marginTop: 20 }}>
                <FileUpload name="taskFile" onChange={handleTaskUpload} label={taskFiles?.length ? 'Ещё файл задания' : 'Файл задания'} accept="*"/>
            </div>
            <Input required onChange={setLessonAlias} label="Alias" value={lessonAlias}/>
            <Button block green disabled={loading}>Сохранить</Button>
        </Form>
    );
}

export default LessonEditForm;